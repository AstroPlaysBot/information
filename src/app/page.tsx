'use client';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
      <p className="text-gray-300">{t('description')}</p>
    </div>
  );
}
