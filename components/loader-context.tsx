"use client";

import React, { createContext, useContext } from "react";

const LoaderReadyContext = createContext<boolean>(false);

export const LoaderProvider = ({
  ready,
  children,
}: {
  ready: boolean;
  children: React.ReactNode;
}) => {
  return (
    <LoaderReadyContext.Provider value={ready}>
      {children}
    </LoaderReadyContext.Provider>
  );
};

export const useLoaderReady = () => {
  return useContext(LoaderReadyContext);
};

export default LoaderReadyContext;
