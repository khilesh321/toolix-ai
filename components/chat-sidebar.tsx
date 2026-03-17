"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Search,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ChatHistoryItem } from "@/lib/chat-store";

function formatUpdatedAt(value: Date): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ChatSidebar({
  chats,
  activeChatId,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
}: {
  chats: ChatHistoryItem[];
  activeChatId: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;

    return chats.filter((chat) => chat.title.toLowerCase().includes(q));
  }, [chats, query]);

  const list = (
    <ScrollArea className="flex-1 p-2">
      <div className="space-y-1 pb-3">
        {filteredChats.length === 0 && (
          <div className="px-3 py-4 text-xs text-muted-foreground">
            No chats found
          </div>
        )}

        {filteredChats.map((chat) => {
          const isActive = chat.chatId === activeChatId;

          return (
            <Link
              key={chat.chatId}
              href={`/chat/${chat.chatId}`}
              onClick={onMobileClose}
              className={cn(
                "block rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-primary/20 border border-primary/30"
                  : "hover:bg-white/8 border border-transparent",
              )}
            >
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <p
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm font-medium",
                    collapsed && "md:hidden",
                  )}
                >
                  {chat.title}
                </p>
                <span
                  className={cn(
                    "shrink-0 whitespace-nowrap text-[10px] text-muted-foreground",
                    collapsed && "md:hidden",
                  )}
                >
                  {hydrated ? formatUpdatedAt(chat.updatedAt) : ""}
                </span>
                <span
                  className={cn(
                    "hidden md:inline-flex text-sm font-medium",
                    !collapsed && "md:hidden",
                  )}
                >
                  {chat.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex shrink-0 border-r border-white/8 bg-[#060606] transition-all duration-200",
          collapsed ? "w-12" : "w-72",
        )}
      >
        <div className="flex h-full w-full flex-col">
          <div className="p-3 border-b border-white/8 space-y-3">
            <div
              className={cn("flex items-center gap-2", collapsed && "flex-col")}
            >
              <Button
                asChild
                variant={"ghost"}
                className={cn(
                  "flex-1 justify-start gap-2 min-w-0",
                  collapsed && "w-full px-0 justify-center",
                )}
              >
                <Link href="/chat" title="New Chat">
                  <MessageSquarePlus className="size-4" />
                  <span className={cn(collapsed && "hidden")}>New Chat</span>
                </Link>
              </Button>

              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={onToggleCollapsed}
                title={collapsed ? "Expand" : "Collapse"}
              >
                {collapsed ? (
                  <ChevronRight className="size-4" />
                ) : (
                  <ChevronLeft className="size-4" />
                )}
              </Button>
            </div>

            <div className={cn("relative", collapsed && "hidden")}>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats"
                className="pl-8 bg-white/5 border-white/10"
              />
            </div>
          </div>

          {!collapsed && list}
        </div>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-72 border-r border-white/8 bg-[#060606] transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="p-3 border-b border-white/8 space-y-3">
            <div className="flex items-center gap-2">
              <Button asChild className="flex-1 justify-start gap-2">
                <Link href="/chat" onClick={onMobileClose}>
                  <MessageSquarePlus className="size-4" />
                  New Chat
                </Link>
              </Button>

              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={onMobileClose}
                title="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats"
                className="pl-8 bg-white/5 border-white/10"
              />
            </div>
          </div>

          {list}
        </aside>
      </div>
    </>
  );
}
