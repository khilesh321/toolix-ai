"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat-header";
import { EmptyState } from "@/components/empty-state";
import { ChatMessage } from "@/components/chat-message";
import { TypingIndicator } from "@/components/typing-indicator";
import { ChatInput } from "@/components/chat-input";

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionClick = (message: string) => {
    sendMessage({ text: message });
  };

  return (
    <div className="h-screen bg-linear-to-br from-background via-background to-muted/50 flex flex-col">
      <Card className="flex-1 flex flex-col rounded-none border-0 border-b shadow-none">
        <ChatHeader />

        <ScrollArea
          ref={scrollRef}
          className="flex-1 p-4 px-6 overflow-hidden pb-20"
        >
          <div className="space-y-6 max-w-4xl mx-auto overflow-hidden">
            {messages.length === 0 && (
              <EmptyState onSuggestionClick={handleSuggestionClick} />
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator />
            )}
          </div>
        </ScrollArea>
      </Card>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
