import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import ChatClient from "@/components/chat-client";
import { chatExists, listChats, loadChat } from "@/lib/chat-store";

export const metadata: Metadata = {
  title: "Chat - Toolix AI",
  description:
    "Chat with Toolix AI - Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
  openGraph: {
    title: "Chat - Toolix AI",
    description:
      "Chat with Toolix AI - Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chat - Toolix AI",
    description:
      "Chat with Toolix AI - Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
  },
};

export default async function ChatByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { id } = await params;

  const ownsChat = await chatExists(userId, id);

  if (!ownsChat) {
    redirect("/chat");
  }

  const initialMessages = await loadChat(userId, id);
  const chatHistory = await listChats(userId);

  return (
    <ChatClient
      id={id}
      initialMessages={initialMessages}
      chatHistory={chatHistory}
    />
  );
}
