import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
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
  );
}
