'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Music2 } from 'lucide-react';

const FixedFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-neutral-950/80 backdrop-blur-md mt-auto">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── BRANDING ── */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <div>
              <span className="text-white font-bold text-lg tracking-tight">AstroPlaysBot</span>
              <p className="text-gray-500 text-sm leading-relaxed mt-2 max-w-xs">
                Modularer Discord-Bot mit webbasiertem Dashboard –
                für Communities, die mehr aus Discord herausholen wollen.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="INSTAGRAM_LINK_HIER"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-pink-400 hover:bg-white/[0.08] hover:border-pink-500/20 transition-all duration-200"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@cryptix.astroplays?_r=1&_t=ZG-95rF41t9uJV"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-white/[0.08] hover:border-cyan-500/20 transition-all duration-200"
              >
                <Music2 size={16} />
              </a>
              <a
                href="YOUTUBE_LINK_HIER"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-white/[0.08] hover:border-red-500/20 transition-all duration-200"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* ── WICHTIGE LINKS ── */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-xs font-semibold uppercase tracking-widest">Wichtige Links</span>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'Einloggen', href: '/login' },
                { label: 'Premium', href: '/purchase#premium' },
                { label: 'Spiele', href: '/purchase#games' },
                { label: 'Support', href: '/#support' },
                { label: 'Bewerben', href: '/apply' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── RECHTLICHES ── */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-xs font-semibold uppercase tracking-widest">Rechtliches</span>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'AGB', href: '/AGB' },
                { label: 'Impressum', href: '/Impressum' },
                { label: 'Datenschutz', href: '/Datenschutz' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── KONTAKT ── */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-xs font-semibold uppercase tracking-widest">Kontakt</span>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:astroplays.help@gmail.com"
                className="text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150 w-fit"
              >
                astroplays.help@gmail.com
              </a>
              <a
                href="https://discord.gg/jtxQA7jnKa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors duration-150 w-fit"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Discord beitreten
              </a>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[200px]">
                Support-Anfragen werden in der Regel innerhalb von 24 Stunden beantwortet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-gray-600">
            © {new Date().getFullYear()} AstroPlaysBot. Alle Rechte vorbehalten.
          </span>
          <span className="text-xs text-gray-700">
            Made for Discord Communities
          </span>
        </div>
      </div>

    </footer>
  );
};

export default FixedFooter;
