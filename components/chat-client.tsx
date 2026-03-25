"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat-header";
import { EmptyState } from "@/components/empty-state";
import { ChatMessage } from "@/components/chat-message";
import { TypingIndicator } from "@/components/typing-indicator";
import { ChatInput } from "@/components/chat-input";
import { ChatSidebar } from "@/components/chat-sidebar";
import { Button } from "@/components/ui/button";
import type { ChatHistoryItem } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

const SCROLL_BOTTOM_THRESHOLD = 96;

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
  const isLoading = status === "streaming" || status === "submitted";
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [mode, setMode] = useState("General");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const hasMessages = messages.length > 0;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const resizeRafIdRef = useRef<number | null>(null);
  const settleRafIdsRef = useRef<number[]>([]);
  const settleTimeoutIdsRef = useRef<number[]>([]);
  const lastScrollTopRef = useRef(0);
  const autoScrollEnabledRef = useRef(true);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(sidebarStorageKey);
    if (stored === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(sidebarStorageKey, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    autoScrollEnabledRef.current = autoScrollEnabled;
  }, [autoScrollEnabled]);

  useEffect(() => {
    isNearBottomRef.current = isNearBottom;
  }, [isNearBottom]);

  const getDistanceFromBottom = useCallback((element: HTMLDivElement) => {
    return element.scrollHeight - element.clientHeight - element.scrollTop;
  }, []);

  const scrollToBottomInstant = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
    if (messages.length === 0) {
      element.scrollTop = 0;
      lastScrollTopRef.current = 0;
      if (!isNearBottomRef.current) {
        isNearBottomRef.current = true;
        setIsNearBottom(true);
      }
      return;
    }
    element.scrollTop = element.scrollHeight;
    lastScrollTopRef.current = element.scrollTop;
    if (!isNearBottomRef.current) {
      isNearBottomRef.current = true;
      setIsNearBottom(true);
    }
  }, [messages.length]);

  const clearSettleTasks = useCallback(() => {
    for (const id of settleRafIdsRef.current) {
      cancelAnimationFrame(id);
    }
    settleRafIdsRef.current = [];

    for (const id of settleTimeoutIdsRef.current) {
      window.clearTimeout(id);
    }
    settleTimeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    if (!hasMessages) {
      element.scrollTop = 0;
      lastScrollTopRef.current = 0;
      return;
    }

    scrollToBottomInstant();

    const handleScroll = () => {
      const currentTop = element.scrollTop;
      const distanceFromBottom = getDistanceFromBottom(element);
      const nearBottom = distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD;

      if (nearBottom !== isNearBottomRef.current) {
        isNearBottomRef.current = nearBottom;
        setIsNearBottom(nearBottom);
      }

      if (nearBottom) {
        if (!autoScrollEnabledRef.current) {
          autoScrollEnabledRef.current = true;
          setAutoScrollEnabled(true);
        }
      } else {
        const userScrolledUp = currentTop < lastScrollTopRef.current;
        if (userScrolledUp && autoScrollEnabledRef.current) {
          autoScrollEnabledRef.current = false;
          setAutoScrollEnabled(false);
        }
      }

      lastScrollTopRef.current = currentTop;
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [getDistanceFromBottom, hasMessages, scrollToBottomInstant]);

  useEffect(() => {
    if (!hasMessages) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      clearSettleTasks();
      return;
    }

    if (!autoScrollEnabled) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      clearSettleTasks();
      return;
    }

    if (!isLoading) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      clearSettleTasks();

      const settleSnap = () => {
        if (!autoScrollEnabledRef.current) return;
        scrollToBottomInstant();
      };

      settleSnap();

      const rafA = requestAnimationFrame(() => {
        settleSnap();
        const rafB = requestAnimationFrame(settleSnap);
        settleRafIdsRef.current.push(rafB);
      });
      settleRafIdsRef.current.push(rafA);

      const timeoutA = window.setTimeout(settleSnap, 80);
      const timeoutB = window.setTimeout(settleSnap, 180);
      settleTimeoutIdsRef.current.push(timeoutA, timeoutB);
      return;
    }

    clearSettleTasks();

    const animateToBottom = () => {
      const element = scrollContainerRef.current;
      if (!element || !autoScrollEnabledRef.current || !isLoading) {
        rafIdRef.current = null;
        return;
      }

      const target = element.scrollHeight - element.clientHeight;
      const current = element.scrollTop;
      const delta = target - current;

      if (Math.abs(delta) > 0.5) {
        const step = Math.sign(delta) * Math.max(1, Math.abs(delta) * 0.2);
        element.scrollTop = current + step;
      } else {
        element.scrollTop = target;
      }

      lastScrollTopRef.current = element.scrollTop;
      rafIdRef.current = requestAnimationFrame(animateToBottom);
    };

    rafIdRef.current = requestAnimationFrame(animateToBottom);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [
    autoScrollEnabled,
    clearSettleTasks,
    hasMessages,
    isLoading,
    scrollToBottomInstant,
  ]);

  useEffect(() => {
    return () => {
      clearSettleTasks();
      if (resizeRafIdRef.current !== null) {
        cancelAnimationFrame(resizeRafIdRef.current);
        resizeRafIdRef.current = null;
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [clearSettleTasks]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    if (!hasMessages) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!autoScrollEnabledRef.current) {
        return;
      }
      if (resizeRafIdRef.current !== null) {
        cancelAnimationFrame(resizeRafIdRef.current);
      }
      resizeRafIdRef.current = requestAnimationFrame(() => {
        resizeRafIdRef.current = null;
        if (autoScrollEnabledRef.current) {
          scrollToBottomInstant();
        }
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (resizeRafIdRef.current !== null) {
        cancelAnimationFrame(resizeRafIdRef.current);
        resizeRafIdRef.current = null;
      }
    };
  }, [hasMessages, scrollToBottomInstant]);

  const handleScrollToLatest = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    autoScrollEnabledRef.current = true;
    setAutoScrollEnabled(true);
    scrollToBottomInstant();
  }, [scrollToBottomInstant]);

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
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden min-h-0">
      <ChatSidebar
        chats={chatHistory}
        activeChatId={id}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="relative flex-1 flex flex-col min-w-0 min-h-0">
        <Card className="flex-1 flex flex-col min-h-0 gap-0 py-0 rounded-none border-0 border-b border-white/8 shadow-none bg-transparent">
          <ChatHeader
            mode={mode}
            onModeChange={setMode}
            onMobileMenuClick={() => setMobileSidebarOpen(true)}
          />

          <div className="flex-1 min-h-0 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="h-full w-full overflow-y-scroll p-4 px-6 pb-20"
            >
              <div
                className={cn(
                  "mx-auto w-full",
                  messages.length === 0
                    ? "flex min-h-full items-start justify-center pt-4 pb-24 md:pt-6 md:pb-28"
                    : "w-full max-w-4xl space-y-6",
                )}
              >
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

        {hasMessages && !autoScrollEnabled && !isNearBottom && (
          <div className="pointer-events-none absolute bottom-28 right-4 z-20 md:bottom-24 md:right-8">
            <Button
              type="button"
              onClick={handleScrollToLatest}
              className="pointer-events-auto rounded-full bg-white text-black hover:bg-white/90"
            >
              ⬇ Scroll to latest
            </Button>
          </div>
        )}

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
