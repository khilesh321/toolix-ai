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
  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat();
  const [input, setInput] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAutoScrollRef = useRef(true);
  const isProgrammaticScrollRef = useRef(false);
  const isLoading = status === "streaming" || status === "submitted";
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [mode, setMode] = useState("General");

  useEffect(() => {
    if (isAutoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messages]);

  const scrollToBottom = () => {
    isAutoScrollRef.current = true;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }, 50);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
    if (isAtBottom) {
      isAutoScrollRef.current = true;
    }
  };

  const handleUserScrollInteraction = () => {
    isAutoScrollRef.current = false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input }, { body: { mode } });
    setInput("");
    scrollToBottom();
  };

  const handleSuggestionClick = (message: string) => {
    sendMessage({ text: message });
    scrollToBottom();
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
    regenerate({ messageId });
    scrollToBottom();
  };

  const handleRetry = (messageId: string) => {
    stop();
    regenerate({ messageId });
    scrollToBottom();
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      <Card className="flex-1 flex flex-col rounded-none border-0 border-b border-white/[0.08] shadow-none bg-transparent">
        <ChatHeader mode={mode} onModeChange={setMode} />

        <div
          className="flex-1 overflow-hidden"
          onWheelCapture={handleUserScrollInteraction}
          onTouchMoveCapture={handleUserScrollInteraction}
        >
          <ScrollArea
            viewportRef={viewportRef}
            onScroll={handleScroll}
            className="h-full w-full p-4 px-6 pb-10"
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

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <TypingIndicator />
              )}
              <div ref={messagesEndRef} className="h-20" />
            </div>
          </ScrollArea>
        </div>
      </Card>

      <ChatInput
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stop}
        mode={mode}
        onModeChange={setMode}
      />
    </div>
  );
}
