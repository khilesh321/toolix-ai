import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Sparkles, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  onStop?: () => void;
  mode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

export function ChatInput({
  onChange,
  onSubmit,
  isLoading = false,
  onStop,
  mode,
  onModeChange,
  className,
}: ChatInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modeIcon = {
    General: <MessageSquare className="size-4" />,
    "Study and Learn": <Sparkles className="size-4" />,
  }[mode] || <MessageSquare className="size-4" />;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleModeSelect = (newMode: string) => {
    onModeChange(newMode);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/8 p-4 z-10",
        className,
      )}
    >
      <div className="w-full max-w-xl mx-auto relative">
        <div
          ref={dropdownRef}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-60 pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 p-0 border-0 bg-black/40 hover:bg-accent/50 transition-colors rounded-md flex items-center justify-center"
          >
            {modeIcon}
          </button>

          {isOpen && (
            <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-md shadow-md overflow-hidden">
              <button
                type="button"
                onClick={() => handleModeSelect("General")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors whitespace-nowrap"
              >
                <MessageSquare className="size-4" />
                General
              </button>
              <button
                type="button"
                onClick={() => handleModeSelect("Study and Learn")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors whitespace-nowrap"
              >
                <Sparkles className="size-4" />
                Study and Learn
              </button>
            </div>
          )}
        </div>
        <PlaceholdersAndVanishInput
          placeholders={[
            "Ask about the weather in any city...",
            "Get transcripts from YouTube videos...",
            "Calculate mathematical expressions...",
            "Search the web for information...",
            "Generate images with descriptions...",
            "Search for images online...",
            "Ask me anything...",
          ]}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onStop={onStop}
        />
      </div>
    </div>
  );
}
