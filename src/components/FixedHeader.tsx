'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHomeClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed top-4 left-0 w-full z-50 px-3">
      <div
        className={`
          mx-auto max-w-[1600px]
          h-16 md:h-18
          px-8
          flex items-center justify-between
          rounded-2xl
          bg-neutral-800/90
          border border-white/10
          transition-all duration-300 ease-out
          ${scrolled ? 'backdrop-blur-2xl shadow-xl scale-[1.02]' : ''}
        `}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <Image src="/astroplays.PNG" alt="AstroPlays Logo" width={40} height={40} className="rounded-md" />
          <span className="text-white font-bold text-2xl">AstroPlaysBot</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <button onClick={handleHomeClick} className="hover:text-white transition">{t('home')}</button>
          <a className="hover:text-white transition">{t('modules')}</a>
          <a className="hover:text-white transition">{t('support')}</a>
          <a className="hover:text-white transition">{t('dashboard')}</a>

          {/* Flagge */}
          <button onClick={toggleLanguage} className="hover:opacity-80 transition text-xl">
            {language === 'de' ? '🇩🇪' : '🇬🇧'}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default FixedHeader;
