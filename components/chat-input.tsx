import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-4 z-10">
      <form onSubmit={onSubmit} className="flex gap-2 max-w-4xl mx-auto">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask about the weather in any city..."
          className="flex-1 h-11 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !value.trim()}
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
  );
}
