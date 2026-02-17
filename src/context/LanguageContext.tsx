'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import translations from '../i18n/translations';

type Language = 'de' | 'en';

// Alle gültigen Keys automatisch ableiten
type TranslationObject = typeof translations.de;

type TranslationKeys = keyof TranslationObject;

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

  const t = (key: TranslationKeys) => {
    return translations[language][key] ?? translations.de[key];
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
