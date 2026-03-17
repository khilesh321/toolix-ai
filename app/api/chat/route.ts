import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import {
  createIdGenerator,
  createUIMessageStreamResponse,
  UIMessage,
} from "ai";
import { buildGraph } from "@/lib/graph";
import { loadChat, saveChat } from "@/lib/chat-store";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const id = body.id ?? body.chatId;

  if (!id || typeof id !== "string") {
    return Response.json(
      { error: "Missing required chat id." },
      { status: 400 },
    );
  }

  const mode = typeof body.mode === "string" ? body.mode : undefined;

  let messages: UIMessage[] = [];

  if (Array.isArray(body.messages)) {
    messages = body.messages as UIMessage[];
  } else if (body.message) {
    const previousMessages = await loadChat(id);
    messages = [...previousMessages, body.message as UIMessage];
  } else {
    messages = await loadChat(id);
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

        await saveChat({ chatId: id, messages: nextMessages });
      },
    }),
  });
}
