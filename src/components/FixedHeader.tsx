'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Für Hamburger
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div
        className={`
          w-full
          md:px-8 px-0
          h-16 md:h-18
          flex items-center justify-between
          rounded-none md:rounded-2xl
          bg-neutral-800/90
          border border-white/10
          transition-all duration-300 ease-out
          ${scrolled ? 'backdrop-blur-2xl shadow-xl scale-[1.02]' : ''}
        `}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-3 md:pl-8 pl-4">
          <Image src="/astroplays.PNG" alt="AstroPlays Logo" width={32} height={32} className="rounded-md" />
          <span className="text-white font-bold text-lg md:text-2xl">{/* kleiner auf Handy */}
            AstroPlaysBot
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300 pr-8">
          <button onClick={handleHomeClick} className="hover:text-white transition">{t('home')}</button>
          <a className="hover:text-white transition">{t('modules')}</a>
          <a className="hover:text-white transition">{t('support')}</a>
          <a className="hover:text-white transition">{t('dashboard')}</a>
          <button onClick={toggleLanguage} className="hover:opacity-80 transition text-xl">
            {language === 'de' ? '🇩🇪' : '🇬🇧'}
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center pr-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-800/95 w-full px-4 py-2 flex flex-col gap-2 text-gray-300">
          <button onClick={handleHomeClick} className="hover:text-white transition">{t('home')}</button>
          <a className="hover:text-white transition">{t('modules')}</a>
          <a className="hover:text-white transition">{t('support')}</a>
          <a className="hover:text-white transition">{t('dashboard')}</a>
          <button onClick={toggleLanguage} className="hover:opacity-80 transition text-xl">
            {language === 'de' ? '🇩🇪' : '🇬🇧'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FixedHeader;
