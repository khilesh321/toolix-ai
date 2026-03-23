"use client";

import React, { useEffect, useMemo, useState } from "react";
import LoadingScreen from "./loading-screen";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderProvider } from "./loader-context";
import { usePathname } from "next/navigation";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldUseLoader = useMemo(() => pathname === "/", [pathname]);
  const [isLoading, setIsLoading] = useState(shouldUseLoader);
  const [ready, setReady] = useState(!shouldUseLoader);

  useEffect(() => {
    if (!shouldUseLoader) {
      setIsLoading(false);
      setReady(true);
    }
  }, [shouldUseLoader]);

  return (
    <AnimatePresence mode="wait">
      {shouldUseLoader && isLoading ? (
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
