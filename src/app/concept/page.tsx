'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';

export default function ConceptPage() {
  const { t } = useLanguage();

  return (
    <div className="px-6 py-20 max-w-5xl mx-auto text-white">
      {/* HERO */}
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
        {t('concept.hero.title')}
      </h1>
      <p className="text-xl text-gray-300 mb-20">
        {t('concept.hero.subtitle')}
      </p>

      {/* ASTRO */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold mb-6">
          {t('concept.astro.title')} <span className="text-purple-400">{t('concept.astro.highlight')}</span>
        </h2>

        <p className="text-gray-300 mb-6">
          {t('concept.astro.text1')}
        </p>

        <p className="text-gray-300 mb-8">
          {t('concept.astro.text2')}
        </p>

        <ul className="space-y-3 text-gray-200">
          {t('concept.astro.features').map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>

        <p className="mt-8 text-lg font-semibold text-purple-400">
          {t('concept.astro.footer')}
        </p>
      </section>

      {/* PLAYS */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          {t('concept.plays.title')} <span className="text-green-400">{t('concept.plays.highlight')}</span>
        </h2>

        <p className="text-gray-300 mb-6">
          {t('concept.plays.text1')}
        </p>

        <p className="text-gray-300 mb-8">
          {t('concept.plays.text2')}
        </p>

        <ul className="space-y-3 text-gray-200">
          {t('concept.plays.features').map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>

        <p className="mt-8 text-lg font-semibold text-green-400">
          {t('concept.plays.footer')}
        </p>
      </section>

      {/* ABSCHLUSS */}
      <section className="mt-24 text-center">
        <p className="text-2xl font-bold mb-4">
          {t('concept.closing.title')}
        </p>
        <p className="text-xl text-gray-300">
          {t('concept.closing.subtitle')}
        </p>
      </section>
    </div>
  );
}
