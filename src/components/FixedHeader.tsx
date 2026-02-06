'use client';
import React, { useState, useEffect } from "react";

const FixedHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-black bg-opacity-70' : 'bg-black'
      }`}
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
