"use client";

import { useChat } from "@ai-sdk/react";
import {
  BadgeCheck,
  Bot,
  Cloud,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <div className="h-screen bg-linear-to-br from-background via-background to-muted/50 flex flex-col">
      <Card className="flex-1 flex flex-col rounded-none border-0 border-b shadow-none">
        <CardHeader className="border-b bg-card/80 backdrop-blur-sm shrink-0">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
              <Cloud className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Toolix AI</span>
              <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                <Sparkles className="size-3" /> Powered by AI
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <ScrollArea
          ref={scrollRef}
          className="flex-1 p-4 px-6 overflow-hidden pb-20"
        >
          <div className="space-y-6 max-w-4xl mx-auto overflow-hidden">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-100 text-center gap-4">
                <div className="p-4 rounded-2xl bg-linear-to-br from-primary/10 to-muted/50 border border-primary/10">
                  <Bot className="size-10 text-primary/70" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Welcome to Toolix AI
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Ask me about the weather in any city. Try typing "What's the
                    weather in Tokyo?"
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role !== "user" && (
                  <Avatar className="size-8 border border-border/50 shadow-sm">
                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5">
                      <Bot className="size-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] space-y-2 overflow-hidden wrap-break-word ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-md"
                      : "bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3"
                  }`}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere"
                          >
                            {part.text}
                          </div>
                        );

                      case "data-progress":
                        const data = part.data as { message: string };
                        const success =
                          data.message.includes("successfully") ||
                          data.message.includes("fetched");
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg ${
                              success
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {success ? (
                              <BadgeCheck className="size-3.5" />
                            ) : (
                              <Loader2 className="size-3.5 animate-spin" />
                            )}
                            <span>{data.message}</span>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>

                {message.role === "user" && (
                  <Avatar className="size-8 border border-border/50 shadow-sm">
                    <AvatarFallback className="bg-linear-to-br from-foreground/10 to-foreground/5">
                      <User className="size-4 text-foreground/70" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 justify-start">
                <Avatar className="size-8 border border-border/50 shadow-sm">
                  <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5">
                    <Bot className="size-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="size-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-2 bg-foreground/40 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-4 z-10">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather in any city..."
            className="flex-1 h-11 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="size-11 rounded-xl shrink-0 bg-primary hover:bg-primary/90 shadow-md transition-all hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
