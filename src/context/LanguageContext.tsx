'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Übersetzungen
const translations = {
  de: {
    home: 'Home',
    modules: 'Module',
    support: 'Support',
    dashboard: 'Dashboard',
    welcome: 'Willkommen auf AstroPlaysBot!',
    description: 'Hier findest du alle Module und Funktionen.',
  },
  en: {
    home: 'Home',
    modules: 'Modules',
    support: 'Support',
    dashboard: 'Dashboard',
    welcome: 'Welcome to AstroPlaysBot!',
    description: 'Here you can find all modules and features.',
  },
};

// Gültige Keys für Übersetzungen
type TranslationKeys = 'home' | 'modules' | 'support' | 'dashboard' | 'welcome' | 'description';

type Language = 'de' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setLanguage(prev => (prev === 'de' ? 'en' : 'de'));
  };

  // Typ-sichere Übersetzung
  const t = (key: TranslationKeys) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
