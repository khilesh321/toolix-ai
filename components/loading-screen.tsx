"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  onComplete: () => void;
};

const STATUS_WORDS = [
  "Analyzing Input",
  "Processing Context",
  "Generating Output",
];

export default function LoadingScreen({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timeouts: number[] = [];
    for (let i = 1; i < STATUS_WORDS.length; i++) {
      const t = window.setTimeout(() => setIndex(i), i * 900);
      timeouts.push(t);
    }
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, []);
  useEffect(() => {
    const duration = 2700;
    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - (startRef.current || 0);
      const pct = Math.min(1, elapsed / duration);
      const value = Math.floor(pct * 100);
      setProgress(pct * 100);
      setCountValue(value);
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        setProgress(100);
        setCountValue(100);
        setTimeout(() => onCompleteRef.current(), 400);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const [countValue, setCountValue] = useState(0);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: "var(--bg)" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute top-8 left-8 md:top-12 md:left-12"
        >
          <span
            style={{ color: "var(--muted)" }}
            className="text-xs md:text-sm uppercase tracking-[0.3em]"
          >
            Toolix AI
          </span>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={STATUS_WORDS[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ color: "rgba(245,245,245,0.8)" }}
                className="text-4xl md:text-6xl lg:text-7xl font-display italic"
              >
                {STATUS_WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12"
        >
          <div
            className="font-display text-6xl md:text-8xl lg:text-9xl tabular-nums"
            style={{ color: "var(--text)" }}
          >
            {String(countValue).padStart(3, "0")}
          </div>
        </motion.div>

        <div className="absolute left-0 right-0 bottom-0">
          <div
            style={{ background: "var(--stroke)" }}
            className="h-[3px] bg-[color:var(--stroke)/0.5]"
          >
            <motion.div
              style={{
                height: "100%",
                transformOrigin: "left center",
                background: "var(--accent-gradient)",
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.4)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ type: "tween", duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
