import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ChatClient from "@/components/chat-client";
import { chatExists, listChats, loadChat } from "@/lib/chat-store";

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
