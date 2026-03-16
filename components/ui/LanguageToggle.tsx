"use client";

import { useTranslation } from "@/lib/i18n";
import LanguageToggleItem from "@/components/ui/LanguageToggleItem";

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center p-2 gap-2 rounded-full outline outline-2 outline-alpha outline-offset-[-2px]">
      <LanguageToggleItem country="UK" active={lang === "en"} onClick={() => setLang("en")} />
      <LanguageToggleItem country="FR" active={lang === "fr"} onClick={() => setLang("fr")} />
    </div>
  );
}
