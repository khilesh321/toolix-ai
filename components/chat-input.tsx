import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface ChatInputProps {
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ onChange, onSubmit }: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-4 z-10">
      <PlaceholdersAndVanishInput
        placeholders={[
          "Ask about the weather in any city...",
          "Calculate mathematical expressions...",
          "Search the web for information...",
          "Generate images with descriptions...",
          "Ask me anything...",
        ]}
        onChange={(e) => onChange(e.target.value)}
        onSubmit={onSubmit}
      />
    </div>
  );
}
