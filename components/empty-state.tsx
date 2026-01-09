import { Bot, MapPin, Cloud, Thermometer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  { icon: MapPin, text: "What's the weather in Mumbai?" },
  { icon: Cloud, text: "Tell me the weather in New York" },
  { icon: Thermometer, text: "How's the weather in Delhi?" },
  { icon: Wind, text: "Show me Goa's weather" },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 text-center gap-6">
      <div className="p-4 rounded-2xl bg-linear-to-br from-primary/10 to-muted/50 border border-primary/10">
        <Bot className="size-10 text-primary/70" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">
          Welcome to Toolix AI
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Ask me about the weather in any city around the world
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 px-4 justify-start text-left hover:bg-primary/5 hover:border-primary/30 transition-all group"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            <suggestion.icon className="size-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm">{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
