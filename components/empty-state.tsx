import {
  Bot,
  CloudSun,
  Code2,
  ImagePlus,
  Newspaper,
  Search,
  Video,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  {
    icon: CloudSun,
    title: "Weather Snapshot",
    text: "Compare today's weather in Mumbai, Delhi, and Bengaluru in a quick table.",
  },
  {
    icon: Newspaper,
    title: "Web Research",
    text: "Search the web for today's top AI product launches and summarize what matters.",
  },
  {
    icon: Code2,
    title: "Code Assistant",
    text: "Write an optimized Python function for binary search with a short example.",
  },
  {
    icon: Video,
    title: "YouTube Brief",
    text: "Summarize this YouTube video transcript into 6 key takeaways with action points.",
  },
  {
    icon: ImagePlus,
    title: "Image Generator",
    text: "Generate an image: cinematic monsoon street in Mumbai, neon reflections, ultra detailed.",
  },
  {
    icon: Search,
    title: "Image Finder",
    text: "Find high-quality logo inspiration images for an AI productivity startup.",
  },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8 px-3 py-8 text-center sm:px-6">
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-linear-to-br from-white/8 via-white/4 to-transparent px-5 py-8 shadow-[0_0_60px_-20px_rgba(56,189,248,0.35)] sm:px-8">
        <div className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-cyan-200/20 bg-black/40 backdrop-blur-sm">
          <Bot className="size-8 text-cyan-300" />
        </div>

        <div className="space-y-3">
          <h3 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Start faster with Toolix AI
          </h3>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Ask, calculate, search, generate images, or analyze video
            transcripts. Pick a smart starter below or type your own prompt.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
            Weather
          </span>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
            Calculation
          </span>
          <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs text-blue-200">
            Code
          </span>
          <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs text-orange-200">
            YouTube
          </span>
          <span className="rounded-full border border-pink-300/20 bg-pink-300/10 px-3 py-1 text-xs text-pink-200">
            Images
          </span>
          <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-200">
            Web Search
          </span>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-3 py-1.5 text-xs text-zinc-300">
        <Sparkles className="size-3.5 text-cyan-300" />
        Tap a starter prompt to begin
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.title}
            variant="outline"
            className="group h-auto items-start justify-start whitespace-normal rounded-2xl border-white/12 bg-white/4 px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/6"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            <div className="mr-3 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-black/35">
              <suggestion.icon className="size-4 text-zinc-300 transition-colors group-hover:text-cyan-200" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-zinc-100">
                {suggestion.title}
              </p>
              <p className="wrap-break-word text-xs leading-relaxed text-zinc-400">
                {suggestion.text}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
