import { Bot, Sparkles } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatHeaderProps {
  mode: string;
  onModeChange: (mode: string) => void;
}

export function ChatHeader({ mode, onModeChange }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b bg-card/80 backdrop-blur-sm shrink-0">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Bot className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Toolix AI</span>
            <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
              <Sparkles className="size-3" /> Tool-Enabled AI Agent
            </span>
          </div>
        </div>
        <Select value={mode} onValueChange={onModeChange}>
          <SelectTrigger className="w-fit min-w-40 h-30 hover:bg-accent/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="**:data-[slot=select-scroll-up-button]:hidden **:data-[slot=select-scroll-down-button]:hidden"
          >
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Study and Learn">Study and Learn</SelectItem>
            {/* <SelectItem value="Research">Research</SelectItem> */}
          </SelectContent>
        </Select>
      </CardTitle>
    </CardHeader>
  );
}
