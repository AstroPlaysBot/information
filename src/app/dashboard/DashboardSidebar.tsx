// src/app/dashboard/DashboardSidebar.tsx
'use client';

import React, { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const sections = [

  {
    label: 'AstroModeration',
    sub: [
      'AstroGreeting',
      'AstroBoost',
      'AstroBump',
      'AstroAutoRoles',
      'AstroCall',
      'AstroClear',
      'AstroTickets'
    ]
  },

  {
    label: 'AstroProtect',
    sub: [
      'AstroShield',
      'AstroModeration',
      'AstroModlogs',
      'AstroLogs',
      'AstroLock'
    ]
  },

  {
    label: 'AstroStreams',
    sub: ['Coming Soon...']
  },

  {
    label: 'AstroPLAYS',
    sub: ['Minecraft','GTA V','Fortnite']
  },

  {
    label: 'Premium',
    sub: ['AstroTickets+']
  }

];

interface Props {
  closeSidebar?: () => void;
}

export default function DashboardSidebar({ closeSidebar }: Props) {

  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!guildId) return null;

  return (

    <aside className="w-80 h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-gray-900 to-black shadow-2xl">

      <div>

        <h1
          className="text-3xl font-extrabold mb-10 cursor-pointer hover:text-purple-400"
          onClick={() => router.push(`/dashboard/${guildId}`)}
        >
          🚀 AstroPlays
        </h1>

        <nav className="space-y-2">

          <button
            onClick={() => router.push(`/dashboard/${guildId}`)}
            className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10"
          >
            Übersicht
          </button>

          <button
            onClick={() => router.push(`/dashboard/${guildId}?tab=verwaltung`)}
            className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10"
          >
            Verwaltung
          </button>

          <div className="pt-6 text-gray-500 text-sm">
            MODULES
          </div>

          {sections.map((s) => (

            <div key={s.label}>

              <button
                onClick={() =>
                  setOpenSection(prev => prev === s.label ? null : s.label)
                }
                className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10"
              >
                {s.label}
              </button>

              <AnimatePresence>

                {openSection === s.label && (

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="ml-4 flex flex-col overflow-hidden"
                  >

                    {s.sub.map(sub => (

                      <button
                        key={sub}
                        className="text-left px-4 py-2 rounded-lg hover:bg-purple-700/30"
                      >
                        {sub}
                      </button>

                    ))}

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          ))}

        </nav>

      </div>

      <button
        onClick={() => {
          router.push('/dashboard');
          if (closeSidebar) closeSidebar();
        }}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700"
      >
        Server wechseln
      </button>

    </aside>

  );
}
