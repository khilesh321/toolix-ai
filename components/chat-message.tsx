"use client";

import { Bot, User, BadgeCheck, Loader2, ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

const safeJsonParse = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const formatToolPayload = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const clampText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit)}…`;
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

  const renderToolCard = (
    part: any,
    key: string,
    options?: { sources?: ReactNode }
  ) => {
    const toolName =
      part.toolName || part.name || part.tool || part.type || "tool";
    const status = part.status || part.state || part.phase || "";
    const outputValue = safeJsonParse(part.output ?? part.result);
    const outputText = clampText(formatToolPayload(outputValue), 8000);

    return (
      <div key={key} className="space-y-2">
        <Collapsible defaultOpen={false}>
          <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs text-foreground/90">
            <CollapsibleTrigger className="flex flex-wrap items-center gap-2 w-full justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Tool
                </span>
                <span className="font-medium text-foreground/90">
                  {toolName}
                </span>
                {status && (
                  <span className="rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    {status}
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                Expand
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {outputText && !options?.sources && (
                <div className="mt-2">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                    Output
                  </div>
                  <CodeBlock className="language-json">{outputText}</CodeBlock>
                </div>
              )}
            </CollapsibleContent>
          </div>
          {options?.sources && (
            <CollapsibleContent>{options.sources}</CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
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

          const progressParts = message.parts.filter(
            (p: any) => p.type === "data-progress"
          );
          const otherParts = message.parts.filter(
            (p: any) => p.type !== "data-progress"
          );
          const sortedParts = [...progressParts, ...otherParts];

          const toolParts: ReactNode[] = [];
          const mainParts: ReactNode[] = [];

          if (message.role === "assistant" && text) {
            mainParts.push(
              <ThemeProvider key={`${message.id}-c1`} mode="dark">
                <C1Component
                  isStreaming={isStreaming}
                  c1Response={text}
                  onAction={handleC1Action}
                />
              </ThemeProvider>
            );
          }

          sortedParts.forEach((part: any, i: number) => {
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
                      {processLatex(part.text)}
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
                    <span
                      className={`size-1.5 rounded-full ${
                        success ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                    />
                    {success ? (
                      <span className="flex items-center gap-2 font-medium">
                        <BadgeCheck className="size-3.5" />
                        {data.message}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-medium">
                        <Loader2 className="size-3.5 animate-spin" />
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

                if (part.toolName === "web_search") {
                  const parsedOutput = safeJsonParse(part.output);
                  const results = Array.isArray(parsedOutput)
                    ? parsedOutput
                    : parsedOutput?.results || parsedOutput?.data || [];

                  if (Array.isArray(results) && results.length > 0) {
                    const sources = (
                      <Sources>
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

                    toolParts.push(sources);
                    return;
                  }
                }

                // toolParts.push(renderToolCard(part, `${message.id}-${i}`));

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
