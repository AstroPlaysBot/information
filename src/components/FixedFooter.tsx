// src/components/FixedFooter.tsx
'use client';
import React from 'react';
import Link from 'next/link';

const FixedFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 p-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 border-t border-gray-700 mt-auto">
      {/* Link Gruppe */}
      <div className="flex flex-col md:flex-row gap-4 text-sm md:text-base">
        <Link href="/AGB" className="hover:text-white transition-colors">
          AGB
        </Link>
        <Link href="/Impressum" className="hover:text-white transition-colors">
          Impressum
        </Link>
        <Link href="/Datenschutz" className="hover:text-white transition-colors">
          Datenschutz
        </Link>
        <a
          href="mailto:astroplays.help@gmail.com"
          className="hover:text-white transition-colors"
        >
          Kontakt
        </a>
      </div>

      {/* Copyright / Hinweis */}
      <div className="text-sm md:text-base text-gray-400 mt-4 md:mt-0 text-center md:text-right">
        &copy; {new Date().getFullYear()} AstroPlaysBot. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default FixedFooter;
