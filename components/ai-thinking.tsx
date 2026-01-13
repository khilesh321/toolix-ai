import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const text = "AI is Thinking...";
const letters = text.split("");

export function AIThinking() {
  return (
    <div className="flex gap-3 justify-start" aria-label="AI is thinking">
      <Avatar className="size-8 border border-border/50 shadow-sm">
        <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5">
          <Bot className="size-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
        <div>
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
              className="text-foreground"
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
