"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Hls from "hls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
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
  Menu,
  Search,
  Sparkles,
  Video,
  X,
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

const NAV_LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Preview", href: "#preview" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/5"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Bot className="size-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">Toolix AI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="https://github.com/khilesh321/toolix-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
          >
            <Github className="size-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/chat" className="hidden sm:block">
            <Button
              size="sm"
              className="rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Try Toolix AI
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors relative w-9 h-9 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={cn(
                  "block h-[1.5px] w-full bg-current rounded-full transition-all duration-300 origin-center",
                  mobileOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full bg-current rounded-full transition-all duration-300",
                  mobileOpen && "opacity-0 scale-x-0",
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full bg-current rounded-full transition-all duration-300 origin-center",
                  mobileOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const el = document.querySelector(item.href);
                    if (el) {
                      setTimeout(
                        () => el.scrollIntoView({ behavior: "smooth" }),
                        100,
                      );
                    }
                  }}
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="https://github.com/khilesh321/toolix-ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 flex items-center gap-2"
              >
                <Github className="size-4" />
                GitHub
              </Link>
              <div className="pt-2">
                <Link href="/chat" onClick={() => setMobileOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full rounded-lg shadow-md shadow-primary/20"
                  >
                    Try Toolix AI
                    <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
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
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCount = 75;

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Preload images
      const images: HTMLImageElement[] = [];
      const sequence = { frame: 0 };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(2, "0");
        img.src = `/sequence/frame_${frameNum}_delay-0.066s.webp`;
        images.push(img);
      }

      const render = () => {
        const img = images[sequence.frame];
        if (img && img.complete) {
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Calculate the ratio to cover the canvas
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.max(hRatio, vRatio);

          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;

          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio,
          );
        }
      };

      images[0].onload = render;

      const resizeCanvas = () => {
        if (containerRef.current && canvas) {
          // Use container dimensions or window dimensions
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          render();
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top+=50 top",
          end: "+=2000",
          scrub: 0.5,
          pin: true,
          // markers: true,
        },
      });

      tl.to(
        sequence,
        {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          duration: 1,
          onUpdate: render,
        },
        0,
      );

      tl.fromTo(
        ".feature-card",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
        0,
      );

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    },
    { scope: containerRef },
  );

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      {/* Background Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card/80 text-sm text-muted-foreground mb-6">
            <Sparkles className="size-4 text-primary" />
            Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-shadow-sm">
            What Can Toolix Do?
          </h2>
          <p className="text-foreground/90 text-lg max-w-2xl mx-auto drop-shadow-md">
            Six powerful tools that work together to handle complex tasks — from
            searching the web to generating images.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((feature, i) => (
            <div key={feature.title} className="feature-card opacity-0">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-xl border border-border/60 bg-card/80 backdrop-blur-md p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-colors h-full"
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
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DifferentiatorsSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 top-50 bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.25_250/0.04)_0%,transparent_50%)]" />
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
              className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 hover:border-purple-400/30 hover:shadow-xl hover:shadow-primary/5 transition-all h-full"
            >
              <div className="p-3 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 w-fit mb-5">
                <Layers className="size-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                Generative UI
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Unlike ChatGPT&apos;s text-only responses, Toolix generates
                adaptive, interactive UI components powered by Thesys C1 —
                weather widgets, image galleries, data visualizations, and more
                that render right in the chat.
              </p>
              <div className="rounded-xl overflow-hidden border border-border/40">
                <img
                  src="/generative-ui.gif"
                  alt="Generative UI Demo"
                  className="w-full"
                />
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
              <div className="rounded-xl overflow-hidden border border-border/40">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full"
                  // style={{ filter: "blur(0.35px) contrast(0.9)" }}
                  src="/youtube-summariser-demo.mp4"
                />
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function TechStackVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src =
      "https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8";
    const fallbackSrc = "/_videos/v1/f0c78f536d5f21a047fb7792723a36f9d647daa1";

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          hls?.destroy();
          video.src = fallbackSrc;
          video.play().catch(() => {});
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        video.src = fallbackSrc;
        video.play().catch(() => {});
      });
    } else {
      video.src = fallbackSrc;
      video.play().catch(() => {});
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/10 to-background z-10" />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute md:top-25 inset-0 w-full h-full object-cover mix-blend-screen opacity-50"
      />
    </div>
  );
}

function TechStackSection() {
  return (
    <section id="tech-stack" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto relative z-20">
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

      <TechStackVideo />
    </section>
  );
}

function DemoPreviewSection() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0.5, 0.75], [8, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.75], [0.95, 1]);

  return (
    <section id="preview" className="relative py-24 sm:py-32 px-4 sm:px-6">
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

            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
              src="/ToolixPromo.mp4"
            />
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
      <Navbar />
      <ReactLenis root>
        <HeroSection />
        <FeaturesSection />
        <DifferentiatorsSection />
        <TechStackSection />
      </ReactLenis>
      <DemoPreviewSection />
      <Footer />
    </main>
  );
}
