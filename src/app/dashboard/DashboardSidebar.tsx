'use client';
import React, { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { label: 'AstroModeration', sub: ['AstroGreeting','AstroBoost','AstroBump','AstroAutoRoles','AstroCall','AstroClear','AstroTickets'] },
  { label: 'AstroProtect', sub: ['AstroShield','AstroModeration','AstroModlogs','AstroLogs','AstroLock'] },
  { label: 'AstroStreams', sub: ['Comming Soon...'] },
  { label: 'AstroPLAYS', sub: ['Minecraft','GTA V','Fortnite'] },
  { label: 'Premium', sub: ['AstroTickets+'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!guildId) return null;

  const handleSectionClick = (label: string) => {
    setOpenSection(prev => (prev === label ? null : label));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-80 h-screen fixed left-0 top-0 flex flex-col justify-between p-6 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-3xl shadow-2xl">
        <div>
          {/* Logo / Titel */}
          <h1
            className="text-3xl font-extrabold mb-12 cursor-pointer hover:text-purple-400 transition-colors"
            onClick={() => router.push(`/dashboard/${guildId}`)}
          >
            🚀 AstroPlays
          </h1>

          {/* Navigation */}
          <nav className="space-y-3">
            {sections.map((s) => {
              const active =
                pathname.includes(s.label.toLowerCase().replace(' ', ''));

              return (
                <div key={s.label}>
                  <button
                    onClick={() => handleSectionClick(s.label)}
                    className={`w-full px-5 py-3 text-left rounded-xl transition font-medium ${
                      active
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {s.label}
                  </button>

                  <AnimatePresence>
                    {openSection === s.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-4 mt-2 flex flex-col space-y-1 overflow-hidden"
                      >
                        {s.sub.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => console.log(`Clicked ${sub}`)}
                            className="w-full px-4 py-2 text-left rounded-lg text-gray-300 hover:bg-purple-700/30 hover:text-white transition-all"
                          >
                            {sub}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Server wechseln */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 w-full py-3 rounded-xl text-center font-semibold bg-purple-700/30 hover:bg-purple-600 hover:text-white shadow-lg transition-all"
        >
          Server wechseln
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-10 overflow-hidden relative">
        {/* Hintergrund-Glas-Effekt */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-gray-900 via-black to-gray-800 opacity-50 backdrop-blur-xl"></div>

        <div className="relative z-10 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
