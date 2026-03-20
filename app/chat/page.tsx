import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createChat } from "@/lib/chat-store";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat - Toolix AI",
  description:
    "Start a new chat with Toolix AI - Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
};

export default async function ChatPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const id = await createChat(userId);
  redirect(`/chat/${id}`);
}
