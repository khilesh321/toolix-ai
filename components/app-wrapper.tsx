"use client";

import React, { useState } from "react";
import LoadingScreen from "./loading-screen";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderProvider } from "./loader-context";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen
          key="loading-screen"
          onComplete={() => {
            setIsLoading(false);
            setReady(true);
          }}
        />
      ) : (
        <LoaderProvider ready={ready}>
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </LoaderProvider>
      )}
    </AnimatePresence>
  );
}
