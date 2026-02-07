'use client';
import React, { useState, useEffect } from "react";

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50
        bg-neutral-900
        transition-all duration-300
        ${scrolled ? 'backdrop-blur-xl' : ''}
      `}
    >
      <div className="flex items-center h-24 px-6">
        <h1 className="text-white font-bold text-[64px]">
          AstroPlays
        </h1>
      </div>
    </div>
  );
};

export default FixedHeader;
