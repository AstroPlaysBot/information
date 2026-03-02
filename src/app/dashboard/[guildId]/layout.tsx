// src/app/dashboard/[guildId]/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from '../DashboardSidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {

    const check = () => {

      if (window.innerWidth >= 1024) {
        setIsDesktop(true);
        setSidebarOpen(true);
      } else {
        setIsDesktop(false);
        setSidebarOpen(false);
      }

    };

    check();
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);

  }, []);

  return (

    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">

      {/* Mobile Button */}

      {!isDesktop && (

        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur px-3 py-2 rounded-lg"
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
            transition={{ duration: 0.25 }}
            className="fixed lg:relative z-40"
          >

            <DashboardSidebar
              closeSidebar={() => !isDesktop && setSidebarOpen(false)}
            />

          </motion.div>

        )}

      </AnimatePresence>

      {/* Overlay */}

      {!isDesktop && sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />

      )}

      {/* Content */}

      <main className="flex-1 overflow-auto p-10">

        {children}

      </main>

    </div>

  );

}
