// src/app/dashboard/DashboardSidebar.tsx
'use client';
import React, { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSidebarProps {
  closeSidebar?: () => void; // für mobile
}

const sections = [
  { label: 'AstroModeration', sub: ['AstroGreeting','AstroBoost','AstroBump','AstroAutoRoles','AstroCall','AstroClear','AstroTickets'] },
  { label: 'AstroProtect', sub: ['AstroShield','AstroModeration','AstroModlogs','AstroLogs','AstroLock'] },
  { label: 'AstroStreams', sub: ['Comming Soon...'] },
  { label: 'AstroPLAYS', sub: ['Minecraft','GTA V','Fortnite'] },
  { label: 'Premium', sub: ['AstroTickets+'] },
  { label: 'Dashboard Management', sub: [] }, // NEU
];

export default function DashboardSidebar({ closeSidebar }: DashboardSidebarProps) {
  const { guildId } = useParams<{ guildId?: string }>(); // optional
  const router = useRouter();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Fallback, falls kein guildId existiert
  if (!guildId) {
    return (
      <aside className="w-80 h-screen fixed left-0 top-0 flex items-center justify-center p-6 bg-gray-900 text-gray-400">
        Bitte wähle zuerst einen Server aus.
      </aside>
    );
  }

  const handleSectionClick = (label: string) => {
    setOpenSection(prev => (prev === label ? null : label));
  };

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 flex flex-col justify-between p-6 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-3xl shadow-2xl z-50 md:z-auto">
      <div>
        <h1
          className="text-3xl font-extrabold mb-12 cursor-pointer hover:text-purple-400 transition-colors"
          onClick={() => router.push(`/dashboard/${guildId}`)}
        >
          🚀 AstroPlays
        </h1>

        <nav className="space-y-3">
          {sections.map((s) => {
            const active = pathname?.includes(s.label.toLowerCase().replace(' ', '')) ?? false;
            return (
              <div key={s.label}>
                <button
                  onClick={() => handleSectionClick(s.label)}
                  className={`w-full px-5 py-3 text-left rounded-xl transition font-medium ${
                    active ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {s.label}
                </button>

                <AnimatePresence>
                  {openSection === s.label && s.sub.length > 0 && (
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

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-8 w-full py-3 rounded-xl text-center font-semibold bg-purple-700/30 hover:bg-purple-600 hover:text-white shadow-lg transition-all"
      >
        Server wechseln
      </button>

      {/* Mobile Close Button */}
      {closeSidebar && (
        <button
          className="absolute top-4 right-4 md:hidden p-2 bg-gray-800 rounded"
          onClick={closeSidebar}
        >
          ✕
        </button>
      )}
    </aside>
  );
}
