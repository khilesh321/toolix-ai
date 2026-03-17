import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import {
  createIdGenerator,
  createUIMessageStreamResponse,
  UIMessage,
} from "ai";
import { buildGraph } from "@/lib/graph";
import { auth } from "@clerk/nextjs/server";
import { chatExists, loadChat, saveChat } from "@/lib/chat-store";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json();
  const id = body.id ?? body.chatId;

  if (!id || typeof id !== "string") {
    return Response.json(
      { error: "Missing required chat id." },
      { status: 400 },
    );
  }

  const ownsChat = await chatExists(userId, id);

  if (!ownsChat) {
    return Response.json({ error: "Chat not found." }, { status: 404 });
  }

  const mode = typeof body.mode === "string" ? body.mode : undefined;

  let messages: UIMessage[] = [];

  if (Array.isArray(body.messages)) {
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
