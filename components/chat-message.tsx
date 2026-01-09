import { Bot, User, BadgeCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
        className={`max-w-[80%] space-y-2 overflow-hidden wrap-break-word ${
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
                  >
                    {processLatex(part.text)}
                  </ReactMarkdown>
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
  );
}
