"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Language } from "@/types";

import ruCommon from "@/locales/ru/common.json";
import uzCommon from "@/locales/uz/common.json";

type TranslationsType = typeof ruCommon;

const translations: Record<Language, TranslationsType> = {
  ru: ruCommon,
  uz: uzCommon,
};

interface I18nContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Language;
    if (saved && (saved === "ru" || saved === "uz")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Language) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: unknown = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      
      return typeof value === "string" ? value : key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale } = useI18n();
  return { t, locale };
}
