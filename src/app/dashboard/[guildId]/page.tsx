// src/app/dashboard/[guildId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">

      {/* Hamburger */}
      {!isDesktop && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 220, damping: 25 }}
            className="fixed inset-y-0 left-0 w-80 z-40"
          >
            <DashboardSidebar closeSidebar={() => !isDesktop && setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay (nur mobile) */}
      {!isDesktop && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30"
        />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto p-6 md:p-10 transition-all duration-300 ${
          isDesktop ? 'ml-80' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
}
