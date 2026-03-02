// src/app/dashboard/DashboardSidebar.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modules = [

  {
    label: "AstroModeration",
    items: [
      "AstroGreeting",
      "AstroBoost",
      "AstroBump",
      "AstroAutoRoles",
      "AstroCall",
      "AstroClear",
      "AstroTickets"
    ]
  },

  {
    label: "AstroProtect",
    items: [
      "AstroShield",
      "AstroModeration",
      "AstroModlogs",
      "AstroLogs",
      "AstroLock"
    ]
  },

  {
    label: "AstroStreams",
    items: ["Coming Soon"]
  },

  {
    label: "AstroPLAYS",
    items: ["Minecraft","GTA V","Fortnite"]
  },

  {
    label: "Premium",
    items: ["AstroTickets+"]
  }

];

export default function DashboardSidebar({
  closeSidebar
}: {
  closeSidebar?: () => void
}) {

  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();

  const [open, setOpen] = useState<string | null>(null);

  return (

    <aside className="w-80 h-screen bg-gradient-to-b from-gray-900 to-black p-6 flex flex-col justify-between shadow-2xl">

      <div>

        <h1
          className="text-3xl font-bold mb-10 cursor-pointer hover:text-purple-400"
          onClick={() => router.push(`/dashboard/${guildId}`)}
        >
          🚀 AstroPlays
        </h1>

        <nav className="space-y-2">

          {/* Übersicht */}

          <button
            onClick={() => router.push(`/dashboard/${guildId}`)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
          >
            Übersicht
          </button>

          {/* Verwaltung */}

          <button
            onClick={() => router.push(`/dashboard/${guildId}?tab=verwaltung`)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
          >
            Verwaltung
          </button>

          <div className="pt-6 text-gray-500 text-sm">
            MODULES
          </div>

          {modules.map((m) => (

            <div key={m.label}>

              <button
                onClick={() => setOpen(open === m.label ? null : m.label)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
              >
                {m.label}
              </button>

              <AnimatePresence>

                {open === m.label && (

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden flex flex-col ml-4"
                  >

                    {m.items.map((item) => (

                      <button
                        key={item}
                        className="text-left px-4 py-2 rounded hover:bg-purple-600/30"
                      >
                        {item}
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
          closeSidebar?.();
        }}
        className="bg-purple-600 hover:bg-purple-700 py-3 rounded-lg"
      >
        Server wechseln
      </button>

    </aside>

  );

}
