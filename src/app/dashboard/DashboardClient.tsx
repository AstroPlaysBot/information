'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RoleType, roleColors, roleLabels } from '@/app/utils/roles';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  role: RoleType;
}

export default function DashboardClient() {
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inviteLink =
    "https://discord.com/oauth2/authorize?client_id=1462897111166095412&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fastroplaysbot.vercel.app%2Fapi%2Fdiscord-auth&integration_type=0&scope=guilds+identify+guilds.members.read+bot";

  useEffect(() => {
    async function fetchGuilds() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/guilds');
        const data = await res.json();

        if (!res.ok) {
          // ⚠️ Hier wird jetzt der echte Fehlertext angezeigt
          throw new Error(data.error || 'Fehler beim Laden der Server');
        }

        setGuilds(data.guilds || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Serverfehler');
        setGuilds([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGuilds();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-2xl">
        Lade Server...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold mb-6">Fehler</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
        >
          Erneut versuchen
        </button>
      </div>
    );

  if (guilds.length === 0)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold mb-6">Kein Server gefunden</h2>

        <p className="text-gray-400 mb-10">
          Den Server, den du verwalten möchtest, wird nicht angezeigt? Dann lade den Bot gerne auf deinen Server{' '}
          <a
            href={inviteLink}
            target="_blank"
            className="text-blue-500 underline hover:text-blue-400"
          >
            einladen
          </a>
          .
        </p>

        <a
          href={inviteLink}
          target="_blank"
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform"
        >
          Bot einladen
        </a>
      </div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-6">Serverauswahl</h1>

      {guilds.length > 0 && (
        <p className="text-center text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Den Server, den du verwalten möchtest, wird nicht angezeigt? Dann lade den Bot gerne auf deinen Server{' '}
          <a
            href={inviteLink}
            target="_blank"
            className="text-blue-500 underline hover:text-blue-400"
          >
            einladen
          </a>
          .
        </p>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {guilds.map(g => (
          <motion.a
            key={g.id}
            href={`/dashboard/${g.id}`}
            variants={cardVariants}
            className="flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-700 hover:to-pink-600 transition-transform"
          >
            {g.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=256`}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-5xl font-bold text-white">
                🎮
              </div>
            )}

            <div className="p-6 flex flex-col justify-between h-32">
              <h3 className="text-xl font-bold mb-2 text-white">{g.name}</h3>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${roleColors[g.role]}`}
              >
                {roleLabels[g.role]}
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
