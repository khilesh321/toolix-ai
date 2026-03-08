"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Hls from "hls.js";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Bot,
  Calculator,
  CloudSun,
  Github,
  Globe,
  Image as ImageIcon,
  Layers,
  Search,
  Sparkles,
  Video,
  Zap,
  Code,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

const CYCLING_WORDS = [
  "Web Search",
  "Image Generation",
  "YouTube Summarizer",
  "Weather Lookup",
  "Generative UI",
];

const FEATURES = [
  {
    icon: Globe,
    title: "Web Search",
    description:
      "Search the web in real-time for current events, news, and specific information.",
    color: "text-blue-400",
    bg: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    icon: ImageIcon,
    title: "Image Generation",
    description:
      "Generate original images from text prompts using AI-powered models.",
    color: "text-purple-400",
    bg: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
  },
  {
    icon: Video,
    title: "YouTube Summarizer",
    description:
      "Fetch and intelligently summarize YouTube video transcripts instantly.",
    color: "text-red-400",
    bg: "from-red-500/20 to-red-500/5",
    border: "border-red-500/20",
  },
  {
    icon: CloudSun,
    title: "Weather Lookup",
    description:
      "Get current weather conditions for any city worldwide in seconds.",
    color: "text-amber-400",
    bg: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: Calculator,
    title: "Calculator",
    description:
      "Perform accurate mathematical calculations with step-by-step results.",
    color: "text-emerald-400",
    bg: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: Search,
    title: "Image Search",
    description:
      "Find images from across the web using Google Custom Search integration.",
    color: "text-cyan-400",
    bg: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
  },
];

const TECH_STACK = [
  { name: "Next.js 16", icon: Code },
  { name: "React 19", icon: Zap },
  { name: "LangGraph", icon: Layers },
  { name: "Thesys C1", icon: Sparkles },
  { name: "Vercel AI SDK", icon: MessageSquare },
  { name: "shadcn/ui", icon: Layers },
  { name: "Tailwind CSS", icon: Code },
  { name: "Framer Motion", icon: Zap },
];

function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CyclingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex h-[1.2em] overflow-hidden relative align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={CYCLING_WORDS[index]}
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="inline-block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent font-bold"
        >
          {CYCLING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src =
      "https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover scale-[1.2] origin-left pointer-events-none"
    />
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background Video */}
      <HeroBackgroundVideo />

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--background), transparent)",
        }}
      />

      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.65_0.25_250/0.08)_0%,transparent_70%)]" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse,oklch(0.65_0.25_250/0.06),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse,oklch(0.65_0.15_300/0.04),transparent_70%)] blur-3xl" /> */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="p-4 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 mb-8"
        >
          <Bot className="size-10 sm:size-12 text-primary" />
        </motion.div>

        <Shimmer
          as="h1"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
          duration={3}
          spread={3}
        >
          Toolix AI
        </Shimmer>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center gap-2 mb-6"
        >
          <Sparkles className="size-4 text-white/70" />
          <span className="text-lg sm:text-xl text-white/90 font-medium">
            Tool-Enabled AI Agent
          </span>
          <Sparkles className="size-4 text-white/70" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mb-4"
        >
          Your intelligent assistant powered by <CyclingText />
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="text-sm sm:text-base text-white/70 max-w-xl mb-10"
        >
          Built with LangGraph agents, Thesys C1 generative UI, and Vercel AI
          SDK for real-time streaming — going beyond what traditional chatbots
          can do.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/chat">
            <Button
              size="lg"
              className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Try Toolix AI
              <ArrowRight className="size-5 ml-1" />
            </Button>
          </Link>
          <Link
            href="https://github.com/khilesh-jawale"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="lg"
              className="text-base px-8 py-6 rounded-xl border border-border/60 hover:border-primary/30"
            >
              <Github className="size-5 mr-1" />
              GitHub
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card/80 text-sm text-muted-foreground mb-6">
            <Sparkles className="size-4 text-primary" />
            Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            What Can Toolix Do?
          </h2>
          <p className="text-muted-foreground/80 text-lg max-w-2xl mx-auto">
            Six powerful tools that work together to handle complex tasks — from
            searching the web to generating images.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-colors h-full"
              >
                <div
                  className={cn(
                    "p-3 rounded-xl bg-linear-to-br border w-fit mb-4",
                    feature.bg,
                    feature.border,
                  )}
                >
                  <feature.icon className={cn("size-5", feature.color)} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function DifferentiatorsSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.25_250/0.04)_0%,transparent_50%)]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card/80 text-sm text-muted-foreground mb-6">
            <Zap className="size-4 text-primary" />
            Beyond ChatGPT
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            What Makes Toolix Different
          </h2>
          <p className="text-muted-foreground/80 text-lg max-w-2xl mx-auto">
            Not just another AI chatbot — Toolix brings capabilities that go
            beyond text-only responses.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn direction="right" delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all h-full"
            >
              <div className="p-3 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 w-fit mb-5">
                <Layers className="size-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                Generative UI
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Unlike ChatGPT&apos;s text-only responses, Toolix generates
                adaptive, interactive UI components powered by Thesys C1 —
                weather widgets, image galleries, data visualizations, and more
                that render right in the chat.
              </p>
              <div className="rounded-xl border-2 border-dashed border-border/40 bg-muted/10 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground/40">
                    Screenshot coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 transition-all h-full"
            >
              <div className="p-3 rounded-xl bg-linear-to-br from-red-500/20 to-red-500/5 border border-red-500/20 w-fit mb-5">
                <Video className="size-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors">
                YouTube Video Summarizer
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Paste any YouTube link and get an intelligent summary. Toolix
                fetches the full transcript and analyzes it — no need to watch
                the entire video to get the key insights.
              </p>
              <div className="rounded-xl border-2 border-dashed border-border/40 bg-muted/10 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground/40">
                    Screenshot coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card/80 text-sm text-muted-foreground mb-6">
            <Code className="size-4 text-primary" />
            Tech Stack
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Built With Modern Tech
          </h2>
          <p className="text-muted-foreground/80 text-lg max-w-2xl mx-auto">
            A cutting-edge stack for building intelligent AI applications.
          </p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-4">
          {TECH_STACK.map((tech, i) => (
            <FadeIn key={tech.name} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group flex items-center gap-3 px-5 py-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <tech.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {tech.name}
                </span>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoPreviewSection() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0.5, 0.75], [8, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.75], [0.95, 1]);

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.65_0.25_250/0.04)_0%,transparent_50%)]" />
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card/80 text-sm text-muted-foreground mb-6">
            <MessageSquare className="size-4 text-primary" />
            Preview
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            See It In Action
          </h2>
          <p className="text-muted-foreground/80 text-lg max-w-2xl mx-auto">
            A modern, responsive chat interface with real-time streaming and
            interactive UI components.
          </p>
        </FadeIn>

        <FadeIn>
          <motion.div
            style={{ rotateX, scale, transformPerspective: 1200 }}
            className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/5"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-card/80">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
                <Bot className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Toolix AI</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-2.5" /> Tool-Enabled AI Agent
                </p>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="size-3 rounded-full bg-muted/60" />
                <div className="size-3 rounded-full bg-muted/60" />
                <div className="size-3 rounded-full bg-muted/60" />
              </div>
            </div>

            <div className="aspect-video bg-muted/10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.65_0.25_250/0.03)_0%,transparent_60%)]" />
              <div className="text-center relative z-10">
                <Bot className="size-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground/40 text-sm">
                  Demo preview coming soon
                </p>
                <p className="text-muted-foreground/30 text-xs mt-1">
                  Chat interface screenshot will go here
                </p>
              </div>
            </div>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2} className="text-center mt-10">
          <Link href="/chat">
            <Button
              size="lg"
              className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Try It Yourself
              <ArrowRight className="size-5 ml-1" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
          <div className="flex items-center gap-3 justify-self-center sm:justify-self-start">
            <div className="p-1.5 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
              <Bot className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Toolix AI</p>
              <p className="text-xs text-muted-foreground">
                Tool-Enabled AI Agent
              </p>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground justify-self-center">
            Built with ❤️ by{" "}
            <Link
              href="https://khilesh.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Khilesh Jawale
            </Link>
          </p>

          <div className="flex items-center gap-4 justify-self-center sm:justify-self-end">
            <Link
              href="https://github.com/khilesh-jawale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <DifferentiatorsSection />
      <TechStackSection />
      <DemoPreviewSection />
      <Footer />
    </main>
  );
}
