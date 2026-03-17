import ChatClient from "@/components/chat-client";
import { listChats, loadChat } from "@/lib/chat-store";

export default async function ChatByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialMessages = await loadChat(id);
  const chatHistory = await listChats();

  return (
    <ChatClient
      id={id}
      initialMessages={initialMessages}
      chatHistory={chatHistory}
    />
  );
}
