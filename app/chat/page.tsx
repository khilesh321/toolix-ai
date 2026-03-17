import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createChat } from "@/lib/chat-store";

export default async function ChatPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const id = await createChat(userId);
  redirect(`/chat/${id}`);
}
