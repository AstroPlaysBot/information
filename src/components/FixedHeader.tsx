'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { HiMenu, HiX } from 'react-icons/hi';
import { useRouter, usePathname } from 'next/navigation';

/* ─────────────────────────────────────────
   NAV DATA
───────────────────────────────────────── */
const moduleItems = [
  {
    label: 'AstroModeration',
    href: '/astro/moderation',
    desc: 'Rollen, Tickets & Willkommensnachrichten',
  },
  {
    label: 'AstroProtect',
    href: '/astro/protect',
    desc: 'Logs, Locks & Anti-Raid-Schutz',
  },
  {
    label: 'AstroStreaming',
    href: '/astro/streaming',
    desc: 'Streaming-Integrationen – in Entwicklung',
  },
  {
    label: 'AstroPLAYS',
    href: '/astro/plays',
    desc: 'Gaming-Features direkt in Discord',
  },
];

const marketplaceItems = [
  {
    label: 'Premium',
    href: '/purchase#premium',
    desc: 'Exklusive Features für Power-User',
  },
  {
    label: 'Spiele',
    href: '/purchase#games',
    desc: 'Gaming-Integrationen freischalten',
  },
  {
    label: 'Merch',
    href: '/purchase#merch',
    desc: 'Offizieller AstroPlays-Merch',
  },
];

/* ─────────────────────────────────────────
   DROPDOWN COMPONENT
───────────────────────────────────────── */
type DropdownItem = { label: string; href: string; desc: string };

function NavDropdown({
  label,
  items,
  onClose,
}: {
  label: string;
  items: DropdownItem[];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 80);
  };

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
          open ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {label}
        <svg
          width="11" height="11" viewBox="0 0 11 11" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-64 rounded-xl border border-white/[0.08] bg-[#0e0e12]/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
          {/* top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="p-1.5">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex flex-col gap-0.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-all"
              >
                <span className="text-[13px] font-semibold text-gray-200 group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <span className="text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors leading-snug">
                  {item.desc}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FIXED HEADER
───────────────────────────────────────── */
const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileModuleOpen, setMobileModuleOpen] = useState(false);
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) return null;
  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
    setMobileModuleOpen(false);
    setMobileMarketOpen(false);
  }, []);

  const goHome = () => {
    router.push('/');
    closeMobileMenu();
  };

  const goSection = (id: string) => {
    closeMobileMenu();
    if (pathname !== '/') {
      sessionStorage.setItem('scrollToSection', id);
      router.push('/');
      return;
    }
    const element = document.getElementById(id);
    if (!element) return;
    const pos = element.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  };

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot+applications.commands`;

  const startDiscordAuth = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`);
    const SCOPE = encodeURIComponent('identify guilds guilds.members.read');
    if (!CLIENT_ID || !REDIRECT_URI) { alert('Discord Client ID oder App URL fehlt!'); return; }
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
    closeMobileMenu();
  };

  /* ── CHEVRON SVG ── */
  const Chevron = ({ open }: { open: boolean }) => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
      className={`transition-transform duration-200 ml-auto ${open ? 'rotate-180' : ''}`}>
      <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      {/* ───────────── DESKTOP HEADER ───────────── */}
      <div className={`fixed top-4 left-0 w-full px-4 transition-all duration-300 ${menuOpen ? 'z-30' : 'z-50'}`}>
        <div
          className={`
            mx-auto max-w-[1600px] h-16
            flex items-center justify-between
            rounded-2xl border px-5 md:px-8
            transition-all duration-500 ease-out
            ${scrolled && !menuOpen
              ? 'bg-neutral-950/20 border-white/[0.05] backdrop-blur-3xl shadow-2xl shadow-black/60'
              : 'bg-neutral-900/60 border-white/10 backdrop-blur-md'}
          `}
        >
          {/* LOGO */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={goHome}>
            <Image src="/astroplays.PNG" alt="AstroPlays Logo" width={30} height={30} className="rounded-lg" priority />
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">AstroPlaysBot</span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-0.5 text-sm">
            <button
              onClick={goHome}
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              Home
            </button>

            <NavDropdown label="Module" items={moduleItems} onClose={() => {}} />
            <NavDropdown label="Marketplace" items={marketplaceItems} onClose={() => {}} />

            <button onClick={() => goSection('support')} className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150">
              Support
            </button>
            <button onClick={() => goSection('apply')} className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150">
              Bewerben
            </button>
            <button onClick={() => goSection('team')} className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150">
              Team
            </button>
          </nav>

          {/* RIGHT: Einloggen + Bot einladen */}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
            >
              <DiscordIcon />
              Bot einladen
            </a>
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl p-1">
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* ───────────── MOBILE MENU ───────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMobileMenu}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-[#0c0c10] border-l border-white/[0.07] text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
              <span className="font-semibold text-sm text-gray-300 tracking-wide">Navigation</span>
              <button onClick={closeMobileMenu} className="text-gray-500 hover:text-white transition">
                <HiX size={20} />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex flex-col px-3 py-3 gap-0.5 flex-1 overflow-y-auto">
              <button
                onClick={goHome}
                className="text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm"
              >
                Home
              </button>

              {/* Mobile Module Accordion */}
              <div>
                <button
                  onClick={() => setMobileModuleOpen((v) => !v)}
                  className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                  Module
                  <Chevron open={mobileModuleOpen} />
                </button>
                {mobileModuleOpen && (
                  <div className="mx-2 mb-1 rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    {moduleItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex flex-col px-3.5 py-2.5 hover:bg-white/5 transition-all border-b border-white/[0.04] last:border-0"
                      >
                        <span className="text-[13px] font-medium text-gray-200">{item.label}</span>
                        <span className="text-[11px] text-gray-500 leading-snug">{item.desc}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Marketplace Accordion */}
              <div>
                <button
                  onClick={() => setMobileMarketOpen((v) => !v)}
                  className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                  Marketplace
                  <Chevron open={mobileMarketOpen} />
                </button>
                {mobileMarketOpen && (
                  <div className="mx-2 mb-1 rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    {marketplaceItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex flex-col px-3.5 py-2.5 hover:bg-white/5 transition-all border-b border-white/[0.04] last:border-0"
                      >
                        <span className="text-[13px] font-medium text-gray-200">{item.label}</span>
                        <span className="text-[11px] text-gray-500 leading-snug">{item.desc}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => goSection('support')} className="text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm">
                Support
              </button>
              <button onClick={() => goSection('apply')} className="text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm">
                Bewerben
              </button>
              <button onClick={() => goSection('team')} className="text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm">
                Team
              </button>
            </nav>

            {/* Mobile Bottom Actions */}
            <div className="px-3 pb-6 flex flex-col gap-2.5 border-t border-white/[0.07] pt-4">
              <button
                onClick={startDiscordAuth}
                className="w-full py-2.5 rounded-xl text-gray-400 bg-white/5 hover:bg-white/8 hover:text-white transition text-sm font-medium"
              >
                Einloggen
              </button>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-semibold text-center flex items-center justify-center gap-2"
              >
                <DiscordIcon size={15} />
                Bot einladen
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Discord Icon ─── */
function DiscordIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

export default FixedHeader;
