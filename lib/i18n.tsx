"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

export type Language = "en" | "fr";

type Messages = typeof en;

const messages: Record<Language, Messages> = { en, fr };

const STORAGE_KEY = "lang";

// ─── Context ─────────────────────────────────────────────────────────────────

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "en" || stored === "fr") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  // Resolve a dot-notated key like "nav.home" against the current message file
  const t = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = messages[lang];
      for (const part of parts) {
        if (node == null || typeof node !== "object") return key;
        node = node[part];
      }
      return typeof node === "string" ? node : key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside <I18nProvider>");
  return ctx;
}
