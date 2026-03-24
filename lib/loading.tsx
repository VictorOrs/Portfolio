"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type LoadingCtx = {
  progress:    number;
  isLoaded:    boolean;
  setProgress: (n: number) => void;
  setLoaded:   () => void;
};

const Ctx = createContext<LoadingCtx | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState(0);
  const [isLoaded, setIsLoadedState] = useState(false);

  const setProgress = useCallback((n: number) => setProgressState(n), []);
  const setLoaded   = useCallback(() => setIsLoadedState(true),       []);

  return (
    <Ctx.Provider value={{ progress, isLoaded, setProgress, setLoaded }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoading must be used inside <LoadingProvider>");
  return ctx;
}
