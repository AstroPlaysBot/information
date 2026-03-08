// src/components/FixedFooter.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Music2 } from 'lucide-react';

const FixedFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800 mt-auto">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Branding */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">
            AstroPlaysBot
          </h2>

          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Moderner Discord Bot mit Dashboard zur Verwaltung deiner Server.
          </p>

          {/* Social Icons */}
          <div className="flex gap-5 mt-2">

            {/* Instagram */}
            <a
              href="INSTAGRAM_LINK_HIER"
              target="_blank"
              className="group transition-all"
            >
              <Instagram
                size={24}
                className="text-gray-500 group-hover:text-pink-500 group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.8)] transition-all duration-300"
              />
            </a>

            {/* TikTok */}
            <a
              href="TIKTOK_LINK_HIER"
              target="_blank"
              className="group transition-all"
            >
              <Music2
                size={24}
                className="text-gray-500 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] transition-all duration-300"
              />
            </a>

            {/* YouTube */}
            <a
              href="YOUTUBE_LINK_HIER"
              target="_blank"
              className="group transition-all"
            >
              <Youtube
                size={24}
                className="text-gray-500 group-hover:text-red-500 group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] transition-all duration-300"
              />
            </a>

          </div>

          <div className="text-xs text-gray-500 mt-3">
            © {new Date().getFullYear()} AstroPlaysBot
          </div>
        </div>

        {/* Rechtliches */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-medium text-sm uppercase tracking-wider">
            Rechtliches
          </h3>

          <Link href="/AGB" className="hover:text-white transition-colors text-sm">
            AGB
          </Link>

          <Link href="/Impressum" className="hover:text-white transition-colors text-sm">
            Impressum
          </Link>

          <Link href="/Datenschutz" className="hover:text-white transition-colors text-sm">
            Datenschutz
          </Link>
        </div>

        {/* Kontakt */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-medium text-sm uppercase tracking-wider">
            Kontakt
          </h3>

          <a
            href="mailto:astroplays.help@gmail.com"
            className="hover:text-white transition-colors text-sm"
          >
            astroplays.help@gmail.com
          </a>

          <p className="text-xs text-gray-500">
            Support-Anfragen werden meist innerhalb von 24 Stunden beantwortet.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center text-xs text-gray-500 py-4">
        Made with ❤️ for Discord Communities
      </div>

    </footer>
  );
};

export default FixedFooter;
