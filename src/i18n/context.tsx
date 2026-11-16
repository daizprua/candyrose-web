'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

type Language = 'es' | 'en' | 'pt';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  translations: Record<string, any>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Record<string, any>> = {
  es,
  en,
  pt,
};

const DEFAULT_LANGUAGE: Language = 'es';
const STORAGE_KEY = 'hotelcandyrose_language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isClient, setIsClient] = useState(false);

  // Load language preference from localStorage on client side
  useEffect(() => {
    setIsClient(true);
    // Se lee al montar (no en el render inicial) para que el HTML del servidor
    // y el primer render del cliente coincidan y no haya hydration mismatch.
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLanguage && ['es', 'en', 'pt'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    } catch {
      // Almacenamiento bloqueado (modo privado, cookies desactivadas): se queda en español.
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (['es', 'en', 'pt'].includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Sin almacenamiento disponible: el idioma vale solo para esta página.
      }
    }
  };

  // Translation function with dot notation support
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }

    return typeof value === 'string' ? value : defaultValue || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: translations[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
