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

  const goHome = () => {
    router.push('/');
    setMenuOpen(false);
  };

  const goSection = (id: string) => {
    setMenuOpen(false);
    if (pathname !== '/') {
      sessionStorage.setItem('scrollToSection', id);
      router.push('/');
      return;
    }
    scrollToSection(id);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const headerHeight = 80;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - 8;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot+applications.commands`;

  const startDiscordAuth = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`
    );
    const SCOPE = encodeURIComponent('identify guilds guilds.members.read');
    const RESPONSE_TYPE = 'code';

    if (!CLIENT_ID || !REDIRECT_URI) {
      alert('Discord Client ID oder App URL fehlt!');
      return;
    }

    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
    window.location.href = discordOAuthUrl;
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', action: goHome },
    { label: 'Module', action: () => goSection('astro-moderation') },
    { label: 'Premium & Spiele', action: () => router.push('/purchase') },
    { label: 'Support', action: () => goSection('support') },
    { label: 'Bewerben', action: () => goSection('apply') },
    { label: 'Team', action: () => goSection('team') },
    { label: 'Einloggen', action: startDiscordAuth },
  ];

  return (
    <>
      {/* HEADER */}
      <div
        className={`fixed top-4 left-0 w-full px-4 transition-all duration-300 ${
          menuOpen ? 'z-30' : 'z-50'
        }`}
      >
        <div
          className={`
            mx-auto max-w-[1600px]
            h-16
            flex items-center justify-between
            rounded-2xl
            border border-white/10
            px-5 md:px-8
            transition-all duration-300 ease-out
            ${
              scrolled && !menuOpen
                ? 'bg-neutral-900/90 backdrop-blur-xl shadow-2xl shadow-black/40 scale-[1.01]'
                : 'bg-neutral-900/60 backdrop-blur-md'
            }
          `}
        >
          {/* LOGO */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={goHome}
          >
            <Image
              src="/astroplays.PNG"
              alt="AstroPlays Logo"
              width={30}
              height={30}
              className="rounded-lg"
              priority
            />
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              AstroPlaysBot
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1 text-sm text-gray-400">
            {navLinks.slice(0, -1).map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-150"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* RIGHT SIDE — Einloggen + Bot einladen */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={startDiscordAuth}
              className="px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-150"
            >
              Einloggen
            </button>

            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all duration-150 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
            >
              {/* Discord Icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Bot einladen
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl p-1"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-neutral-950 border-l border-white/10 text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <span className="font-bold text-base tracking-tight">Menü</span>
              <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-400 hover:text-white">
                <HiX />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
              {navLinks.slice(0, -1).map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-left px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Mobile Bottom Actions */}
            <div className="px-4 pb-6 flex flex-col gap-3 border-t border-white/10 pt-4">
              <button
                onClick={startDiscordAuth}
                className="w-full py-2.5 rounded-xl text-gray-300 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
              >
                Einloggen
              </button>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-semibold text-center flex items-center justify-center gap-2"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Bot einladen
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FixedHeader;
