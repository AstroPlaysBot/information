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

  // ❌ Kein Header im Dashboard / Admin
  if (pathname?.startsWith('/dashboard')) return null;
  if (pathname?.startsWith('/admin')) return null;

  // Scroll Effekt
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body Lock bei Mobile Menu
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  // ===== Navigation Helpers =====
  const goHome = () => {
    router.push('/');
    setMenuOpen(false);
  };

  // ===== Discord OAuth =====
  const startDiscordAuth = () => {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`
    );
    const SCOPE = encodeURIComponent('identify');
    const RESPONSE_TYPE = 'code';

    if (!CLIENT_ID || !REDIRECT_URI) {
      alert('Discord Client ID oder App URL fehlt!');
      return;
    }

    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    // Browser redirect
    window.location.href = discordOAuthUrl;
    setMenuOpen(false);
  };

  // Smooth Scroll zu Section mit Header-Offset
  const goSection = (id: string) => {
    setMenuOpen(false);

    const scrollToSection = () => {
      const element = document.getElementById(id);
      if (!element) return;
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 8;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    if (pathname !== '/') {
      router.push('/');
      setTimeout(scrollToSection, 100);
    } else {
      scrollToSection();
    }
  };

  return (
    <>
      {/* HEADER */}
      <div
        className={`fixed top-4 left-0 w-full px-3 transition-all duration-300 ${
          menuOpen ? 'z-30' : 'z-50'
        }`}
      >
        <div
          className={`
            mx-auto max-w-[1600px]
            h-16 md:h-18
            flex items-center justify-between
            rounded-2xl
            bg-neutral-800/70 border border-white/10
            backdrop-blur-md backdrop-brightness-110 backdrop-saturate-120
            px-4 md:px-8
            transition-all duration-300 ease-out
            ${scrolled && !menuOpen ? 'shadow-xl scale-[1.02]' : ''}
          `}
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
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
            <button onClick={goHome} className="hover:text-white transition">Home</button>
            <button onClick={() => goSection('astro-moderation')} className="hover:text-white transition">Module</button>
            <button onClick={() => goSection('support')} className="hover:text-white transition">Support</button>
            <button onClick={() => goSection('apply')} className="hover:text-white transition">Bewerben</button>
            <button onClick={startDiscordAuth} className="hover:text-white transition">Einloggen</button>
          </nav>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute top-0 right-0 h-full w-3/4 max-w-xs bg-neutral-900 text-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setMenuOpen(false)} className="mb-6 text-2xl">
              <HiX />
            </button>

            <ul className="flex flex-col gap-5 text-lg">
              <li><button onClick={goHome}>Home</button></li>
              <li><button onClick={() => goSection('astro-moderation')}>Module</button></li>
              <li><button onClick={() => goSection('support')}>Support</button></li>
              <li><button onClick={() => goSection('apply')}>Bewerben</button></li>
              <li><button onClick={startDiscordAuth}>Einloggen</button></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default FixedHeader;
