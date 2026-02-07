'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { HiMenu, HiX } from 'react-icons/hi';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false); // Menü schließen beim Klick
  };

  return (
    <div className="fixed top-4 left-0 w-full z-50">
      <div
        className={`
          mx-auto max-w-[1600px]
          h-16 md:h-18
          md:px-8
          flex items-center justify-between
          rounded-2xl
          bg-neutral-800/90
          border border-white/10
          transition-all duration-300 ease-out
          ${scrolled ? 'backdrop-blur-2xl shadow-xl scale-[1.02]' : ''}
          px-3 sm:px-0
        `}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-3 pl-3 sm:pl-0">
          <Image src="/astroplays.PNG" alt="AstroPlays Logo" width={32} height={32} className="rounded-md" priority />
          <span className="text-white font-semibold text-lg sm:text-2xl">
            AstroPlaysBot
          </span>
        </div>

        {/* Desktop Navigation */}
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

        {/* Hamburger für Mobil */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-neutral-900 text-white p-6 transition-transform duration-300 ease-in-out md:hidden
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button onClick={() => setMenuOpen(false)} className="mb-6 text-2xl">
          <HiX />
        </button>
        <ul className="flex flex-col gap-4 text-lg">
          <li>
            <button onClick={handleHomeClick} className="hover:text-gray-300">{t('home')}</button>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">{t('modules')}</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">{t('support')}</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">{t('dashboard')}</a>
          </li>
          <li>
            <button onClick={toggleLanguage} className="hover:text-gray-300 text-xl mt-4">
              {language === 'de' ? '🇩🇪' : '🇬🇧'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FixedHeader;
