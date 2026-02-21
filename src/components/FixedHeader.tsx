'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HiMenu, HiX } from 'react-icons/hi';
import { useRouter, usePathname } from 'next/navigation';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Header nicht im Dashboard / Admin anzeigen
  if (pathname?.startsWith('/dashboard')) return null;
  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const handleHomeClick = () => {
    router.push('/');
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    router.push('/login');
    setMenuOpen(false);
  };

  const handleModuleClick = () => {
    const scrollToModule = () => {
      const section = document.querySelector('#astro-moderation');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (window.location.pathname !== '/') {
      router.push('/');
      setTimeout(scrollToModule, 200);
    } else {
      scrollToModule();
    }

    setMenuOpen(false);
  };

  const handleApplyClick = () => {
    const scrollToApply = () => {
      const section = document.querySelector('#apply');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (window.location.pathname !== '/') {
      router.push('/');
      setTimeout(scrollToApply, 200);
    } else {
      scrollToApply();
    }

    setMenuOpen(false);
  };

  const handleSupportClick = () => {
    const scrollToSupport = () => {
      const section = document.querySelector('#support');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (window.location.pathname !== '/') {
      router.push('/');
      setTimeout(scrollToSupport, 200);
    } else {
      scrollToSupport();
    }

    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* HEADER */}
      <div className={`fixed top-4 left-0 w-full px-3 transition-all duration-300 ${menuOpen ? 'z-30' : 'z-50'}`}>
        <div className={`
            mx-auto max-w-[1600px]
            h-16 md:h-18
            flex items-center justify-between
            rounded-2xl
            bg-neutral-800/70 border border-white/10
            backdrop-blur-md backdrop-brightness-110 backdrop-saturate-120
            px-4 md:px-8
            transition-all duration-300 ease-out
            ${scrolled && !menuOpen ? 'shadow-xl scale-[1.02]' : ''}
          `}>
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleHomeClick}>
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
            <button onClick={handleSupportClick} className="hover:text-white transition">Support</button>
            <button onClick={handleApplyClick} className="hover:text-white transition">Bewerben</button>
            <button onClick={handleLoginClick} className="hover:text-white transition">Einloggen</button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute top-0 right-0 h-full w-3/4 max-w-xs bg-neutral-900 text-white p-6 transition-transform" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeMenu} className="mb-6 text-2xl"><HiX /></button>

            <ul className="flex flex-col gap-5 text-lg">
              <li><button onClick={handleHomeClick}>Home</button></li>
              <li><button onClick={handleModuleClick}>Module</button></li>
              <li><button onClick={handleSupportClick}>Support</button></li>
              <li><button onClick={handleApplyClick}>Bewerben</button></li>
              <li><button onClick={handleLoginClick}>Einloggen</button></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default FixedHeader;
