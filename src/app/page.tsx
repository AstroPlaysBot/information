'use client';

import React from 'react';
import Background from '../components/Background';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <Background />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-start justify-center min-h-[80vh] px-8 max-w-7xl mx-auto">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          {t('home.title')}
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          {t('home.description')}
        </p>

        <div className="flex items-center gap-4">
          <a
            href="/concept"
            className="inline-flex items-center justify-center rounded-lg
                       bg-indigo-600 hover:bg-indigo-500 transition
                       text-white font-semibold px-6 py-3"
          >
            {t('home.featuresLink')}
          </a>
        </div>
      </section>

      {/* Hinweis: Modulare Sections wurden entfernt */}
    </>
  );
}
