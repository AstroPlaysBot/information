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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <>
      {/* HEADER */}
      <div className={`fixed top-4 left-0 w-full z-50 px-3 sm:px-0 transition-all duration-300`}>
        <div
          className={`
            mx-auto max-w-[1600px]
            h-16 md:h-18
            md:px-8
            flex items-center justify-between
            rounded-2xl
            bg-neutral-800/70 border border-white/10
            backdrop-blur-md backdrop-brightness-110 backdrop-saturate-120
            transition-all duration-300 ease-out
            px-3 sm:px-0
            ${scrolled && !menuOpen ? 'shadow-xl scale-[1.02] backdrop-blur-lg' : ''}
          `}
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 pl-3 sm:pl-0">
            <Image
              src="/astroplays.PNG"
              alt="AstroPlays Logo"
              width={32}
              height={32}
              className="rounded-md"
              priority
            />
            <span className="text-white font-semibold text-lg sm:text-2xl">
              AstroPlaysBot
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <button
              onClick={handleHomeClick}
              className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              {t('nav.home')}
            </button>

            <a className="hover:text-white transition">{t('nav.modules')}</a>
            <a className="hover:text-white transition">{t('nav.support')}</a>
            <a className="hover:text-white transition">{t('nav.dashboard')}</a>

            <button
              onClick={toggleLanguage}
              className="hover:opacity-80 transition text-xl"
            >
              {language === 'de' ? '🇩🇪' : '🇬🇧'}
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl focus:outline-none"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`
          fixed top-0 right-0 h-full w-3/4 max-w-xs bg-neutral-900
          text-white p-6 transform transition-transform duration-300 z-50 md:hidden
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <button onClick={() => setMenuOpen(false)} className="mb-6 text-2xl">
          <HiX />
        </button>

        <ul className="flex flex-col gap-4 text-lg">
          <li>
            <button
              onClick={handleHomeClick}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20"
            >
              {t('nav.home')}
            </button>
          </li>
          <li><a className="hover:text-gray-300">{t('nav.modules')}</a></li>
          <li><a className="hover:text-gray-300">{t('nav.support')}</a></li>
          <li><a className="hover:text-gray-300">{t('nav.dashboard')}</a></li>
          <li>
            <button
              onClick={toggleLanguage}
              className="hover:text-gray-300 text-xl mt-4"
            >
              {language === 'de' ? '🇩🇪' : '🇬🇧'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default FixedHeader;
