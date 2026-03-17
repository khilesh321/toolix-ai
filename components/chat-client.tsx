"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat-header";
import { EmptyState } from "@/components/empty-state";
import { ChatMessage } from "@/components/chat-message";
import { TypingIndicator } from "@/components/typing-indicator";
import { ChatInput } from "@/components/chat-input";
import { ChatSidebar } from "@/components/chat-sidebar";
import type { ChatHistoryItem } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

export default function ChatClient({
  id,
  initialMessages,
  chatHistory,
}: {
  id: string;
  initialMessages: UIMessage[];
  chatHistory: ChatHistoryItem[];
}) {
  const sidebarStorageKey = "toolix-sidebar-collapsed";

  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat({
      id,
      messages: initialMessages,
    });

  const [input, setInput] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [mode, setMode] = useState("General");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(sidebarStorageKey);
    if (stored === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(sidebarStorageKey, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input }, { body: { id, mode } });
    setInput("");
  };

  const handleSuggestionClick = (message: string) => {
    sendMessage({ text: message }, { body: { id, mode } });
  };

  const handleStartEdit = (messageId: string) => {
    stop();
    setEditingMessageId(messageId);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleSaveEdit = (messageId: string, newText: string) => {
    if (!newText.trim()) return;
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;
    const updatedMessage = {
      ...messages[messageIndex],
      parts: [{ type: "text" as const, text: newText }],
    };
    const truncatedMessages = messages.slice(0, messageIndex);
    const newMessages = [...truncatedMessages, updatedMessage];
    setMessages(newMessages);
    setEditingMessageId(null);
    regenerate({ messageId, body: { id, mode } });
  };

  const handleRetry = (messageId: string) => {
    stop();
    regenerate({ messageId, body: { id, mode } });
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">
      <ChatSidebar
        chats={chatHistory}
        activeChatId={id}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 flex flex-col rounded-none border-0 border-b border-white/8 shadow-none bg-transparent">
          <ChatHeader
            mode={mode}
            onModeChange={setMode}
            onMobileMenuClick={() => setMobileSidebarOpen(true)}
          />

          <div className="flex-1 overflow-hidden">
            <div
              ref={viewportRef}
              onScroll={handleScroll}
              className="h-full w-full overflow-y-auto p-4 px-6 pb-20"
            >
              <div className="space-y-6 max-w-4xl mx-auto overflow-hidden">
                {messages.length === 0 && (
                  <EmptyState onSuggestionClick={handleSuggestionClick} />
                )}

                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    sendMessage={sendMessage}
                    isStreaming={isLoading}
                    isEditing={editingMessageId === message.id}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    onRetry={handleRetry}
                  />
                ))}

                {isLoading &&
                  messages[messages.length - 1]?.role === "user" && (
                    <TypingIndicator />
                  )}
              </div>
            </div>
          </div>
        </Card>

        <ChatInput
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onStop={stop}
          mode={mode}
          onModeChange={setMode}
          className={cn(
            "left-0",
            sidebarCollapsed ? "md:left-18" : "md:left-72",
          )}
        />
      </div>
    </div>
  );
}
