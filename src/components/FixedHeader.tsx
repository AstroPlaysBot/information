'use client';
import React, { useEffect, useState } from 'react';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 w-full z-50 px-3">
      <div
        className={`
          mx-auto max-w-[1600px]
          h-16 md:h-18
          px-8
          flex items-center justify-between
          rounded-2xl
          bg-neutral-800/90
          border border-white/10
          transition-all duration-300 ease-out
          ${scrolled
            ? 'backdrop-blur-2xl shadow-xl scale-[1.02]'
            : ''
          }
        `}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-white font-semibold text-lg">
            AstroPlays
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a className="hover:text-white transition">Home</a>
          <a className="hover:text-white transition">Funktionen</a>
          <a className="hover:text-white transition">Blog</a>
          <a className="hover:text-white transition">Support</a>
        </nav>
      </div>
    </div>
  );
};

export default FixedHeader;
