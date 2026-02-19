'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const FixedFooter: React.FC = () => {
  const pathname = usePathname();

  // Footer auf /dashboard oder Unterseiten ausblenden
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <footer className="w-full bg-neutral-900/90 text-gray-300 p-4 md:p-6 mt-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
      {/* Link Gruppe */}
      <div className="flex flex-col md:flex-row gap-4 text-sm md:text-base">
        <a href="/impressum" className="hover:text-white transition">Impressum</a>
        <a href="mailto:astroplays.help@gmail.com" className="hover:text-white transition">astroplays.help@gmail.com</a>
        <a href="/datenschutz" className="hover:text-white transition">Datenschutz</a>
      </div>

      {/* Copyright / Hinweis */}
      <div className="text-sm md:text-base text-gray-400 mt-2 md:mt-0">
        &copy; {new Date().getFullYear()} AstroPlaysBot. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default FixedFooter;
