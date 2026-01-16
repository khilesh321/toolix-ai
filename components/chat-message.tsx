"use client";

import { Bot, User, BadgeCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "@/components/code-block";
import { Shimmer } from "./ai-elements/shimmer";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "./ai-elements/sources";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";

const markdownComponents = {
  pre: ({ children }: any) => {
    const child = children?.props;
    const className = child?.className || "";
    const code = child?.children || "";

    return <CodeBlock className={className}>{code}</CodeBlock>;
  },
  p: ({ children }: any) => <div>{children}</div>,
  code: ({ inline, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 text-xs font-mono">
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto -mx-4 px-4 my-4">
      <table {...props}>{children}</table>
    </div>
  ),
};

const markdownPlugins = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex],
};

const processLatex = (text: string) => {
  let processed = text
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");
  return processed;
};

interface ChatMessageProps {
  message: UIMessage;
  onAction?: (payload: {
    llmFriendlyMessage: string;
    humanFriendlyMessage: string;
  }) => void;
  isStreaming?: boolean;
}

export function ChatMessage({
  message,
  onAction,
  isStreaming = false,
}: ChatMessageProps) {
  const renderImage = (imageUrl: string, key: string) => (
    <img
      key={key}
      src={imageUrl}
      alt="Generated Image"
      className="max-w-full h-auto rounded-lg shadow-md"
    />
  );

  const parseAndRenderImage = (data: any, key: string) => {
    let parsed;
    try {
      if (typeof data === "string") {
        parsed = JSON.parse(data);
      } else {
        parsed = data;
      }
      if (parsed.imageUrl && typeof parsed.imageUrl === "string") {
        return renderImage(parsed.imageUrl, key);
      }
    } catch {}
    return null;
  };

  const handleC1Action = ({
    llmFriendlyMessage,
    humanFriendlyMessage,
  }: any) => {
    if (onAction) {
      onAction({ llmFriendlyMessage, humanFriendlyMessage });
    }
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
          const textParts = message.parts.filter((p: any) => p.type === "text");
          const text = textParts.map((part: any) => part.text).join("");

          if (message.role === "assistant" && text) {
            return (
              <ThemeProvider mode="dark">
                <C1Component
                  isStreaming={isStreaming}
                  c1Response={text}
                  onAction={handleC1Action}
                />
              </ThemeProvider>
            );
          }

          const progressParts = message.parts.filter(
            (p: any) => p.type === "data-progress"
          );
          const otherParts = message.parts.filter(
            (p: any) => p.type !== "data-progress"
          );
          const sortedParts = [...progressParts, ...otherParts];

          return sortedParts.map((part: any, i: number) => {
            switch (part.type) {
              case "text": {
                const imageFromText = parseAndRenderImage(
                  part.text,
                  `${message.id}-${i}`
                );
                if (imageFromText) {
                  return imageFromText;
                }

                return (
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
                      {processLatex(part.text)}
                    </ReactMarkdown>
                  </div>
                );
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
                      <div className="flex gap-2">
                        <BadgeCheck className="size-3.5" />
                        <span>{data.message}</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Loader2 className="size-3.5 animate-spin" />
                        <Shimmer>{data.message}</Shimmer>
                      </div>
                    )}
                  </div>
                );

              case "dynamic-tool":
                const imageFromTool = parseAndRenderImage(
                  part.output,
                  `${message.id}-${i}`
                );
                if (imageFromTool) return imageFromTool;

                if (part.toolName === "web_search") {
                  let searchResults;
                  try {
                    if (typeof part.output === "string") {
                      searchResults = JSON.parse(part.output);
                    } else {
                      searchResults = part.output;
                    }

                    if (!searchResults) return null;

                    const results = Array.isArray(searchResults)
                      ? searchResults
                      : searchResults.results || searchResults.data || [];

                    if (Array.isArray(results) && results.length > 0) {
                      return (
                        <Sources key={`${message.id}-${i}`}>
                          <SourcesTrigger count={results.length} />
                          <SourcesContent>
                            {results.map((result: any, idx: number) => (
                              <Source
                                key={idx}
                                href={result.url || result.link}
                                title={result.title || `Source ${idx + 1}`}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      );
                    }
                  } catch (error) {
                    console.error("Error parsing web search results:", error);
                  }
                }

                return null;

              default:
                return null;
            }
          });
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
