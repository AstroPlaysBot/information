'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations.ts';

type Language = 'de' | 'en';

// 🔹 Alle erlaubten Keys definieren (verschachtelt)
export type TranslationKeys =
  | 'nav.home'
  | 'nav.modules'
  | 'nav.support'
  | 'nav.dashboard'
  | 'home.title'
  | 'home.description'
  | 'home.featuresLink';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>('de');

  // Sprache aus LocalStorage laden
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) setLanguage(saved);
  }, []);

  // Sprache speichern
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'de' ? 'en' : 'de'));
  };

  // 🔹 t() unterstützt jetzt verschachtelte Keys wie "nav.modules"
  const t = (key: TranslationKeys): string => {
    const [section, subkey] = key.split('.') as [keyof typeof translations.de, string];
    return translations[language][section][
      subkey as keyof typeof translations.de[typeof section]
    ] as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
