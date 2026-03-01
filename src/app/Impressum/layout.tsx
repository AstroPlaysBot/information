// src/app/Impreesum/layout.tsx
'use client';
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const toggleLanguage = () => setLanguage(prev => (prev === 'de' ? 'en' : 'de'));

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-4">AstroPlaysBot</h2>

        <button
          onClick={toggleLanguage}
          className="mb-6 px-3 py-2 bg-purple-600 rounded hover:bg-purple-500"
        >
          {language === 'de' ? 'Wechsel zu Englisch' : 'Switch to German'}
        </button>

        <nav className="flex flex-col space-y-2">
          <a href="/AGB" className="hover:text-purple-400">{language === 'de' ? 'AGB' : 'Terms of Service'}</a>
          <a href="/Impressum" className="hover:text-purple-400">{language === 'de' ? 'Impressum' : 'Imprint'}</a>
          <a href="/Datenschutz" className="hover:text-purple-400">{language === 'de' ? 'Datenschutz' : 'Privacy Policy'}</a>

          <div className="mt-4 text-sm">
            <p>{language === 'de' ? 'Kontakt:' : 'Contact:'}</p>
            <p>Discord: <a href="https://discord.com/users/3cvhBBm87G" className="underline">3cvhBBm87G</a></p>
            <p>Email: <a href="mailto:astroplays.help@gmail.com" className="underline">astroplays.help@gmail.com</a></p>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
