import { Bot, Menu, Sparkles } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  mode: string;
  onModeChange: (mode: string) => void;
  onMobileMenuClick?: () => void;
}

export function ChatHeader({
  mode,
  onModeChange,
  onMobileMenuClick,
}: ChatHeaderProps) {
  return (
    <CardHeader className="border-b border-white/8 bg-[#0a0a0a] backdrop-blur-sm shrink-0">
      <CardTitle className="flex items-center gap-3">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="sm:hidden"
          onClick={onMobileMenuClick}
          title="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="hidden sm:flex p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
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
