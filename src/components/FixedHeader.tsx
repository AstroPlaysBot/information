'use client';
import React, { useState, useEffect } from 'react';

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 w-full z-50 px-6">
      <div
        className={`
          mx-auto max-w-7xl
          h-16 px-6
          flex items-center justify-between
          rounded-xl
          bg-neutral-900/95
          transition-all duration-300
          ${scrolled ? 'backdrop-blur-xl shadow-lg' : ''}
        `}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            {/* Platzhalter Logo */}
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-white font-semibold text-lg">
            AstroPlays
          </span>
        </div>

        {/* Navigation (optional) */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a className="hover:text-white transition">Home</a>
          <a className="hover:text-white transition">Features</a>
          <a className="hover:text-white transition">Blog</a>
          <a className="hover:text-white transition">Support</a>
        </nav>
      </div>
    </div>
  );
};

export default FixedHeader;
