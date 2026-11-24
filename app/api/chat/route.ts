import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import {
  createIdGenerator,
  createUIMessageStreamResponse,
  UIMessage,
} from "ai";
import { z } from "zod";
import { CHAT_MODES } from "@/lib/system-prompt";
import { buildGraph } from "@/lib/graph";
import { auth } from "@clerk/nextjs/server";
import { chatExists, loadChat, saveChat } from "@/lib/chat-store";
import { rateLimitChat } from "@/lib/rate-limit";

export const maxDuration = 30;

// ---- Zod schemas (H-1 fix) ----
// Strict allow-list of accepted part shapes. Unknown shapes are rejected
// so a malicious client cannot sneak arbitrarily sized payloads through.
// Client-supplied message ids are dropped — the server regenerates them.
const uiTextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(32_000),
});

const uiToolInvocationPartSchema = z.object({
  type: z.literal("tool-invocation"),
  toolInvocation: z
    .object({
      toolName: z.string().max(64),
      state: z.string().max(32),
    })
    .loose(),
});

const allowedPartSchema = z.union([
  uiTextPartSchema,
  uiToolInvocationPartSchema,
]);

const uiMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(allowedPartSchema).min(1).max(200),
});

const chatPostSchema = z.object({
  id: z.string().max(128).optional(),
  chatId: z.string().max(128).optional(),
  mode: z.string().max(64).optional(),
  // Client can send either `messages` (full history) or a single `message`.
  messages: z.array(uiMessageSchema).max(100).optional(),
  message: uiMessageSchema.optional(),
});

// Hard cap on the raw request body before we parse JSON — defense in
// depth on top of Vercel's platform-level body size limit.
const MAX_BODY_BYTES = 1_000_000;

// ---- Mode allow-list shared with lib/system-prompt.ts ----
const ALLOWED_MODES = new Set<string>(CHAT_MODES);

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  // ---- Per-user rate limit (H-2 fix) ----
  // Caps LLM + paid-tool (NVIDIA / Tavily / CSE) spend per user.
  // NOTE: per-process only on serverless; swap for a shared store if a
  // hard cap across instances is required.
  const rl = rateLimitChat(userId);
  if (!rl.allowed) {
    return Response.json(
      { error: "Too many chat requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfterSeconds),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // ---- Parse + validate body (H-1 fix) ----
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large." }, { status: 413 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatPostSchema.safeParse(rawBody);
  if (!parsed.success) {
    // Log server-side; do not leak schema structure back to the client.
    console.warn(
      "[chat] invalid body:",
      JSON.stringify(parsed.error.issues.slice(0, 5)),
    );
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const body = parsed.data;
  const id = body.id ?? body.chatId;

  if (!id) {
    return Response.json(
      { error: "Missing required chat id." },
      { status: 400 },
    );
  }

  const ownsChat = await chatExists(userId, id);

  if (!ownsChat) {
    return Response.json({ error: "Chat not found." }, { status: 404 });
  }

  const mode =
    body.mode && ALLOWED_MODES.has(body.mode) ? body.mode : undefined;

  let messages: UIMessage[] = [];

  if (body.messages) {
    messages = body.messages as UIMessage[];
  } else if (body.message) {
    const previousMessages = await loadChat(userId, id);
    messages = [...previousMessages, body.message as UIMessage];
  } else {
    messages = await loadChat(userId, id);
  }

  if (messages.length === 0) {
    return Response.json(
      { error: "No messages available for this chat." },
      { status: 400 },
    );
  }

  const graph = buildGraph(mode);

  const langchainMessages = await toBaseMessages(messages);
  const generateMessageId = createIdGenerator({ prefix: "msg", size: 16 });

  const stream = await graph.stream(
    { messages: langchainMessages },
    { streamMode: ["values", "messages", "custom"] },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream, {
      onFinal: async (completion) => {
        const assistantMessage: UIMessage = {
          id: generateMessageId(),
          role: "assistant",
          parts: [{ type: "text", text: completion }],
        };

        const nextMessages = completion.trim().length
          ? [...messages, assistantMessage]
          : messages;

        await saveChat({ userId, chatId: id, messages: nextMessages });
      },
    }),
  });
}
