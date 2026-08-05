"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type LocaleCode = "en" | "hi" | "ta";

type Dictionary = Record<string, string>;

const dictionaries: Record<LocaleCode, Dictionary> = {
  en: {
    "app.tagline": "Learn. Prepare. Build. Get Hired.",
    "nav.dashboard": "Dashboard",
    "nav.insights": "Insights",
    "auth.signIn": "Sign in to Ellowring",
  },
  hi: {
    "app.tagline": "सीखें. तैयारी करें. बनाएँ. नौकरी पाएँ.",
    "nav.dashboard": "डैशबोर्ड",
    "nav.insights": "इनसाइट्स",
    "auth.signIn": "Ellowring में साइन इन करें",
  },
  ta: {
    "app.tagline": "கற்றுக்கொள்ளுங்கள். தயாராகுங்கள். உருவாக்குங்கள். வேலை பெறுங்கள்.",
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.insights": "நுண்ணறிவு",
    "auth.signIn": "Ellowring-இல் உள்நுழைக",
  },
};

type I18nValue = {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => dictionaries[locale][key] || dictionaries.en[key] || key,
    }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
