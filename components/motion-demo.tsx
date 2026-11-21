"use client";

import { useEffect, useRef, useState } from "react";

type OpenerWindow = Window & {
  OPENER?: { tl?: { pause: () => void; play: () => void } };
};

/**
 * Cinematic Toolix AI demo (built with the Bang Motion skill) embedded as a
 * self-contained animated `iframe`.
 *
 * Delivery notes:
 *  - Lazy: the animated document only mounts once the frame scrolls near the
 *    viewport, so it never competes with the hero for initial load.
 *  - Poster fallback: the static thumbnail is painted underneath and remains
 *    as the visual until the animation document has loaded.
 *  - Reduced motion: the demo document itself checks
 *    `prefers-reduced-motion` and holds on a still frame instead of
 *    autoplaying, so this wrapper stays deliberately dumb about it.
 *  - The timeline is paused while the frame is scrolled out of view.
 */
export function MotionDemo({ src = "/demo/index.html" }: { src?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  // Defer mounting the animated document until it's close to being on screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause the timeline while the frame is scrolled away to avoid wasted work.
  useEffect(() => {
    if (!nearViewport) return;
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      const opener = (iframeRef.current?.contentWindow as OpenerWindow | null)
        ?.OPENER;
      if (!opener?.tl) return;
      try {
        if (entry.isIntersecting) opener.tl.play();
        else opener.tl.pause();
      } catch {
        /* frame not ready yet — safe to ignore */
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [nearViewport]);

  return (
    <div
      ref={frameRef}
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-[#050505] shadow-2xl shadow-primary/5"
    >
      {/* Poster — painted underneath and shown until the animation loads. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/demo/poster.jpg"
        alt="Toolix AI responding to prompts with web search and image generation"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {nearViewport && (
        <iframe
          ref={iframeRef}
          src={src}
          title="Toolix AI animated product demo"
          className="absolute inset-0 h-full w-full"
          scrolling="no"
          allow="autoplay"
          loading="lazy"
        />
      )}
    </div>
  );
}
