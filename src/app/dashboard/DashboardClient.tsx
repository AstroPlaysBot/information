// src/app/dashboard/DashboardClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  role: 'OWNER' | 'CO_OWNER' | 'PARTNER';
}

export default function DashboardClient() {

  const router = useRouter();

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/guilds')
      .then(res => res.json())
      .then(data => {
        setGuilds(data.guilds || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-2xl">
        Lade Server...
      </div>
    );

  if (guilds.length === 0)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">

        <h2 className="text-4xl font-bold mb-6">
          Kein Server gefunden
        </h2>

        <p className="text-gray-400 mb-10">
          Lade den Bot zuerst auf einen Server ein.
        </p>

        <a
          href="https://discord.com/oauth2/authorize?client_id=1462897111166095412&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fastroplaysbot.vercel.app%2Fapi%2Fdiscord-auth&integration_type=0&scope=guilds+identify+guilds.members.read+bot"
          target="_blank"
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105"
        >
          Bot einladen
        </a>

      </div>
    );

  // Role Colors
  const roleColor = {
    OWNER: "bg-green-600",
    CO_OWNER: "bg-yellow-500",
    PARTNER: "bg-orange-500"
  };

  // Role Mapping für Anzeige
  const roleLabel = (role: 'OWNER' | 'CO_OWNER' | 'PARTNER') => {
    switch(role) {
      case 'OWNER': return 'Eigentümer';
      case 'CO_OWNER': return 'Miteigentümer';
      case 'PARTNER': return 'Teilhaber';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen px-10 py-16">

      <h1 className="text-5xl font-bold text-center mb-16">
        Server auswählen
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        {guilds.map(g => (

          <motion.button
            key={g.id}
            onClick={() => router.push(`/dashboard/${g.id}`)}
            whileHover={{ scale: 1.08 }}
            className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-700 hover:to-pink-600"
          >

            {g.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=256`}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-3xl">
                {g.name[0]}
              </div>
            )}

            <div className="p-6">

              <h3 className="text-xl font-bold mb-2">
                {g.name}
              </h3>

              <span className={`px-2 py-1 text-xs rounded ${roleColor[g.role]}`}>
                {roleLabel(g.role)}
              </span>

            </div>

          </motion.button>

        ))}

      </motion.div>

    </div>
  );
}
