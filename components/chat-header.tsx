import { Bot, Sparkles } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ChatHeaderProps {
  mode: string;
  onModeChange: (mode: string) => void;
}

export function ChatHeader({ mode, onModeChange }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b bg-card/80 backdrop-blur-sm shrink-0">
      <CardTitle className="flex items-center gap-3">
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Bot className="size-4 sm:size-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-semibold">Toolix AI</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-normal flex items-center gap-1">
            <Sparkles className="size-2.5 sm:size-3" /> Tool-Enabled AI Agent
          </span>
        </div>
      </CardTitle>
    </CardHeader>
  );
}
