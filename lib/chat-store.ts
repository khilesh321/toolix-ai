import { generateId, UIMessage } from "ai";
import { getDb } from "@/lib/mongodb";

type ChatDocument = {
  userId: string;
  chatId: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
};

export type ChatHistoryItem = {
  chatId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

function clamp(text: string, size: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= size) return normalized;
  return `${normalized.slice(0, size)}...`;
}

function extractText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join(" ")
    .trim();
}

function toHistoryItem(chat: ChatDocument): ChatHistoryItem {
  const firstUserMessage = chat.messages.find((msg) => msg.role === "user");

  const titleText = firstUserMessage ? extractText(firstUserMessage) : "";

  return {
    chatId: chat.chatId,
    title: clamp(titleText || "New Chat", 48),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
}

async function getChatsCollection() {
  const db = await getDb();
  return db.collection<ChatDocument>("chats");
}

export async function createChat(userId: string): Promise<string> {
  const chatId = generateId();
  const now = new Date();
  const chats = await getChatsCollection();

  await chats.updateOne(
    { userId, chatId },
    {
      $setOnInsert: {
        userId,
        chatId,
        messages: [],
        createdAt: now,
      },
      $set: {
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  return chatId;
}

export async function loadChat(
  userId: string,
  chatId: string,
): Promise<UIMessage[]> {
  const chats = await getChatsCollection();
  const chat = await chats.findOne(
    { userId, chatId },
    { projection: { messages: 1 } },
  );
  return chat?.messages || [];
}

export async function chatExists(
  userId: string,
  chatId: string,
): Promise<boolean> {
  const chats = await getChatsCollection();
  const chat = await chats.findOne(
    { userId, chatId },
    { projection: { _id: 1 } },
  );

  return Boolean(chat);
}

export async function saveChat({
  userId,
  chatId,
  messages,
}: {
  userId: string;
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const now = new Date();
  const chats = await getChatsCollection();

  await chats.updateOne(
    { userId, chatId },
    {
      $setOnInsert: {
        userId,
        chatId,
        createdAt: now,
      },
      $set: {
        messages,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
}

export async function listChats(
  userId: string,
  limit = 100,
): Promise<ChatHistoryItem[]> {
  const chats = await getChatsCollection();
  const rows = await chats
    .find(
      { userId },
      {
        projection: {
          chatId: 1,
          messages: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    )
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();

  return rows
    .filter((row) => row.messages.some((message) => message.role === "user"))
    .map(toHistoryItem);
}
