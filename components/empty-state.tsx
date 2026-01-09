import { Bot } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 text-center gap-4">
      <div className="p-4 rounded-2xl bg-linear-to-br from-primary/10 to-muted/50 border border-primary/10">
        <Bot className="size-10 text-primary/70" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">
          Welcome to Toolix AI
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Ask me about the weather in any city. Try typing "What's the weather
          in Mumbai?"
        </p>
      </div>
    </div>
  );
}
