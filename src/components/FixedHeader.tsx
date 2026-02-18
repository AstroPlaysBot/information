'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HiMenu, HiX } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Scroll-Effekt für Schatten/Scale
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body Overflow verhindern, wenn Mobile Menü offen ist
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const handleHomeClick = () => router.push('/');
  const handleLoginClick = () => {
    router.push('/login');
    setMenuOpen(false);
  };

  // Module Scroll-Funktion, TS-kompatibel
  const handleModuleClick = () => {
    const scrollToModule = () => {
      const section = document.querySelector('#astro-moderation');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    if (window.location.pathname !== '/') {
      // Wenn man nicht auf Startseite, zuerst zur Home navigieren
      router.push('/'); 
      setTimeout(scrollToModule, 200); // kleine Verzögerung bis Home geladen ist
    } else {
      scrollToModule();
    }

    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* HEADER */}
      <div className={`fixed top-4 left-0 w-full px-3 sm:px-0 transition-all duration-300 ${menuOpen ? 'z-30' : 'z-50'}`}>
        <div className={`
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
        `}>
          {/* LOGO */}
          <div className="flex items-center gap-3 pl-3 sm:pl-0 cursor-pointer" onClick={handleHomeClick}>
            <Image
              src="/astroplays.PNG"
              alt="AstroPlays Logo"
              width={32}
              height={32}
              className="rounded-md"
              priority
            />
            <span className="text-white font-semibold text-lg sm:text-2xl">AstroPlaysBot</span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <button onClick={handleHomeClick} className="hover:text-white transition">Home</button>
            <button onClick={handleModuleClick} className="hover:text-white transition">Module</button>
            <a href="#support" className="hover:text-white transition">Support</a>
            <button onClick={handleLoginClick} className="hover:text-white transition">Einloggen</button>
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
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu}>
          {/* Hintergrund klickbar */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Slide-in Menü */}
          <div
            className="absolute top-0 right-0 h-full w-3/4 max-w-xs bg-neutral-900 text-white p-6 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()} // verhindert, dass Klick auf Menü es schließt
          >
            <button onClick={closeMenu} className="mb-6 text-2xl">
              <HiX />
            </button>

            <ul className="flex flex-col gap-4 text-lg">
              <li>
                <button onClick={() => { handleHomeClick(); closeMenu(); }} className="hover:text-gray-300">Home</button>
              </li>
              <li>
                <button onClick={() => { handleModuleClick(); closeMenu(); }} className="hover:text-gray-300">Module</button>
              </li>
              <li><a className="hover:text-gray-300">Support</a></li>
              <li>
                <button onClick={() => { handleLoginClick(); closeMenu(); }} className="hover:text-gray-300">Einloggen</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default FixedHeader;
