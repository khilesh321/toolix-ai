"use client";

import { Bot, User, BadgeCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Shimmer } from "./ai-elements/shimmer";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "./ai-elements/sources";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";
import { markdownComponents, markdownPlugins } from "./markdown-config";
import { safeJsonParse } from "@/lib/chat-utils";

interface ChatMessageProps {
  message: UIMessage;
  sendMessage: (message: { text: string }) => void;
  isStreaming?: boolean;
}

export function ChatMessage({
  message,
  sendMessage,
  isStreaming = false,
}: ChatMessageProps) {
  const renderImage = (imageUrl: string, key: string) => (
    <Image
      key={key}
      src={imageUrl}
      alt="Generated Image"
      width={500}
      height={500}
      className="max-w-full h-auto rounded-lg shadow-md"
    />
  );

  const parseAndRenderImage = (data: unknown, key: string) => {
    let parsed: unknown;
    try {
      if (typeof data === "string") {
        parsed = JSON.parse(data);
      } else {
        parsed = data;
      }
      if (
        parsed &&
        typeof parsed === "object" &&
        "imageUrl" in parsed &&
        typeof (parsed as { imageUrl: unknown }).imageUrl === "string"
      ) {
        return renderImage((parsed as { imageUrl: string }).imageUrl, key);
      }
    } catch {}
    return null;
  };

  return (
    <div
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
        className={`max-w-[calc(100vw-6rem)] sm:max-w-[85%] md:max-w-[80%] space-y-2 overflow-hidden wrap-break-word ${
          message.role === "user"
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-md"
            : "bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3"
        }`}
      >
        {(() => {
          const textParts = message.parts.filter((p) => p.type === "text");
          const text = textParts.map((part) => part.text).join("");

          const progressParts = message.parts.filter(
            (p) => p.type === "data-progress"
          );
          const otherParts = message.parts.filter(
            (p) => p.type !== "data-progress"
          );
          const sortedParts = [...progressParts, ...otherParts];

          const toolParts: React.ReactNode[] = [];
          const mainParts: React.ReactNode[] = [];

          if (message.role === "assistant" && text) {
            const hasCloudinaryLink = /res\.cloudinary\.com/.test(text);
            if (!hasCloudinaryLink) {
              mainParts.push(
                <ThemeProvider key={`${message.id}-c1`} mode="dark">
                  <C1Component
                    isStreaming={isStreaming}
                    c1Response={text}
                    onAction={(e: any) => {
                      const { llmFriendlyMessage, humanFriendlyMessage } =
                        e.params || {};
                      if (llmFriendlyMessage && humanFriendlyMessage) {
                        sendMessage({ text: llmFriendlyMessage });
                      }
                    }}
                  />
                </ThemeProvider>
              );
            }
          }

          sortedParts.forEach((part, i) => {
            switch (part.type) {
              case "text": {
                if (message.role === "assistant" && text) {
                  return;
                }
                const imageFromText = parseAndRenderImage(
                  part.text,
                  `${message.id}-${i}`
                );
                if (imageFromText) {
                  mainParts.push(imageFromText);
                  return;
                }

                mainParts.push(
                  <div
                    key={`${message.id}-${i}`}
                    className={`text-sm ${
                      part.text.includes("\\[") || part.text.includes("\\(")
                        ? "leading-[2.5]"
                        : "leading-relaxed"
                    } prose prose-sm dark:prose-invert max-w-none [&_table]:border [&_table]:border-border [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2`}
                  >
                    <ReactMarkdown
                      {...markdownPlugins}
                      components={markdownComponents}
                    >
                      {part.text}
                    </ReactMarkdown>
                  </div>
                );
                return;
              }

              case "data-progress":
                const data = part.data as { message: string };
                const successKeywords = [
                  "successfully",
                  "fetched",
                  "created",
                  "updated",
                  "completed",
                ];

                const success = successKeywords.some((keyword) =>
                  data.message.includes(keyword)
                );

                toolParts.push(
                  <div
                    key={`${message.id}-${i}`}
                    className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg border shadow-sm ${
                      success
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {success ? (
                      <span className="flex items-center gap-2 font-medium">
                        <BadgeCheck className="w-4 h-4" />
                        {data.message}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-medium">
                        <Shimmer>{data.message}</Shimmer>
                      </span>
                    )}
                  </div>
                );

                return;

              case "tool-call":
              case "tool-call-delta":
                return;

              case "tool-result":
              case "tool-result-delta":
              case "dynamic-tool":
                const imageFromTool = parseAndRenderImage(
                  part.output,
                  `${message.id}-${i}`
                );
                if (imageFromTool) {
                  toolParts.push(imageFromTool);
                  return;
                }

                if ((part as any).toolName === "web_search") {
                  const parsedOutput = safeJsonParse(part.output);
                  const results = Array.isArray(parsedOutput)
                    ? parsedOutput
                    : parsedOutput?.results || parsedOutput?.data || [];

                  if (Array.isArray(results) && results.length > 0) {
                    const sources = (
                      <Sources key={`${message.id}-sources-${i}`}>
                        <SourcesTrigger count={results.length} />
                        <SourcesContent>
                          {results.map(
                            (
                              result: {
                                url?: string;
                                link?: string;
                                title?: string;
                              },
                              idx: number
                            ) => (
                              <Source
                                key={idx}
                                href={result.url || result.link || ""}
                                title={result.title || `Source ${idx + 1}`}
                              />
                            )
                          )}
                        </SourcesContent>
                      </Sources>
                    );

                    toolParts.push(sources);
                    return;
                  }
                }

                return;

              default:
                return;
            }
          });

          return [...toolParts, ...mainParts];
        })()}
      </div>

      {message.role === "user" && (
        <Avatar className="size-8 border border-border/50 shadow-sm">
          <AvatarFallback className="bg-linear-to-br from-foreground/10 to-foreground/5">
            <User className="size-4 text-foreground/70" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
