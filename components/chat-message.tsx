import { Bot, User, BadgeCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "@/components/code-block";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const processLatex = (text: string) => {
    // Convert \[ \] to $$ $$
    let processed = text.replace(/\\\[/g, "$$").replace(/\\\]/g, "$$");
    // Convert \( \) to $ $
    processed = processed.replace(/\\\(/g, "$").replace(/\\\)/g, "$");
    return processed;
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
        {message.parts.map((part: any, i: number) => {
          switch (part.type) {
            case "text":
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
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      pre: ({ children, ...props }: any) => {
                        const child = children?.props;
                        const className = child?.className || "";
                        const code = child?.children || "";

                        return (
                          <CodeBlock className={className}>{code}</CodeBlock>
                        );
                      },
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
                    }}
                  >
                    {processLatex(part.text)}
                  </ReactMarkdown>
                </div>
              );

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
  );
}
