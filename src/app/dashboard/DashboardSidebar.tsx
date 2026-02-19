'use client';
import { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  {
    label: 'AstroModeration',
    sub: ['AstroGreeting','AstroBoost','AstroBump','AstroAutoRoles','AstroCall','AstroClear','AstroTickets']
  },
  {
    label: 'AstroProtect',
    sub: ['AstroShield','AstroModeration','AstroModlogs','AstroLogs','AstroLock']
  },
  {
    label: 'AstroStreams',
    sub: ['Comming Soon...']
  },
  {
    label: 'AstroPLAYS',
    sub: ['Minecraft','GTA V','Fortnite']
  },
  {
    label: 'Premium',
    sub: ['AstroTickets+']
  },
];

export default function DashboardSidebar() {
  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!guildId) return null;

  const handleSectionClick = (label: string) => {
    setOpenSection(prev => (prev === label ? null : label));
  };

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 flex flex-col justify-between p-6 bg-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden">
      <div>
        <h1 className="text-3xl font-extrabold mb-12 animate-fadeIn cursor-pointer" onClick={() => router.push(`/dashboard/${guildId}`)}>
          🚀 AstroPlays
        </h1>

        <nav className="space-y-3">
          {sections.map((s) => {
            const active =
              (s.label === 'AstroModeration' && pathname.includes('/moderation')) ||
              (s.label === 'AstroProtect' && pathname.includes('/protect')) ||
              (s.label === 'AstroStreams' && pathname.includes('/streams')) ||
              (s.label === 'AstroPLAYS' && pathname.includes('/plays')) ||
              (s.label === 'Premium' && pathname.includes('/premium'));

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
                      {s.sub.map(sub => (
                        <button
                          key={sub}
                          onClick={() => console.log(`Clicked ${sub}`)}
                          className="w-full px-4 py-2 text-left rounded-lg text-gray-300 hover:bg-white/10 transition"
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
        className="mt-8 w-full py-3 rounded-xl text-center font-semibold bg-white/10 hover:bg-purple-600 hover:text-white shadow-lg transition"
      >
        Server wechseln
      </button>
    </aside>
  );
}
