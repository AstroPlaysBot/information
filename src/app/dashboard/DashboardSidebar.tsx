'use client';
import React, { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Kategorien + Unterpunkte
const sections = [
  { label: 'AstroModeration', sub: ['AstroGreeting','AstroBoost','AstroBump','AstroAutoRoles','AstroCall','AstroClear','AstroTickets'] },
  { label: 'AstroProtect', sub: ['AstroShield','AstroModeration','AstroModlogs','AstroLogs','AstroLock'] },
  { label: 'AstroStreams', sub: ['Coming Soon...'] },
  { label: 'AstroPLAYS', sub: ['Minecraft','GTA V','Fortnite'] },
  { label: 'Premium', sub: ['AstroTickets+'] },
  { label: 'Verwaltung', sub: [] }, // wird dynamisch
];

interface DashboardSidebarProps {
  closeSidebar?: () => void;
}

export default function DashboardSidebar({ closeSidebar }: DashboardSidebarProps) {
  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!guildId) return null;

  const handleSectionClick = (label: string) => {
    setOpenSection(prev => (prev === label ? null : label));
  };

  const handleSubClick = (sub: string) => {
    console.log(`Clicked ${sub}`);
    if (closeSidebar) closeSidebar();
  };

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 flex flex-col justify-between p-6 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-3xl shadow-2xl z-40">
      <div>
        <h1
          className="text-3xl font-extrabold mb-12 cursor-pointer hover:text-purple-400 transition-colors"
          onClick={() => {
            router.push(`/dashboard/${guildId}`);
            if (closeSidebar) closeSidebar();
          }}
        >
          🚀 AstroPlays
        </h1>

        <nav className="space-y-3">
          {sections.map((s) => {
            const active = pathname.includes(s.label.toLowerCase().replace(' ', ''));

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
                          onClick={() => handleSubClick(sub)}
                          className="w-full px-4 py-2 text-left rounded-lg text-gray-300 hover:bg-purple-700/30 hover:text-white transition-all"
                        >
                          {sub}
                        </button>
                      ))}

                      {/* Verwaltung Input für Owner */}
                      {s.label === 'Verwaltung' && (
                        <div className="mt-2 flex flex-col space-y-2">
                          <input
                            type="text"
                            placeholder="User ID hinzufügen"
                            className="px-3 py-2 rounded-lg text-black"
                          />
                          <select className="px-3 py-2 rounded-lg text-black">
                            <option value="TEILHABER">Teilhaber</option>
                            <option value="COOWNER">Co-Owner</option>
                          </select>
                          <button className="px-3 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition">
                            Hinzufügen
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => {
          router.push('/dashboard');
          if (closeSidebar) closeSidebar();
        }}
        className="mt-8 w-full py-3 rounded-xl text-center font-semibold bg-purple-700/30 hover:bg-purple-600 hover:text-white shadow-lg transition-all"
      >
        Server wechseln
      </button>
    </aside>
  );
}
