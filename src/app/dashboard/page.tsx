'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default function DashboardSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Kein Discord-Code gefunden.');
      setLoading(false);
      return;
    }

    fetch('/api/discord-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Discord Auth Fehler: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data.guilds || data.guilds.length === 0) {
          setError('Keine Server gefunden. Bitte stelle sicher, dass du mindestens einen Server verwaltest.');
        } else {
          setGuilds(data.guilds);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message || 'Fehler beim Laden der Server.');
      })
      .finally(() => setLoading(false));
  }, [code]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-white text-2xl">
        Lade Server…
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white text-center p-6">
        <p className="mb-6 text-red-500">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-pink-600 transition text-white font-semibold"
        >
          Zurück zur Startseite
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-6 py-16 text-white">
      <h1 className="text-5xl font-extrabold text-center mb-16 animate-fadeIn">
        Wähle einen Server
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {guilds.map(g => (
          <motion.button
            key={g.id}
            onClick={() => router.push(`/dashboard/${g.id}`)}
            className="group relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-700 hover:to-pink-600 transition transform hover:scale-105"
            whileHover={{ scale: 1.06 }}
          >
            {g.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`}
                alt={g.name}
                className="w-full h-40 object-cover rounded-t-3xl"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-white/10 rounded-t-3xl">
                <span className="text-3xl font-bold">{g.name[0]}</span>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{g.name}</h3>
              {g.owner && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-600 rounded-full shadow-lg">
                  Eigentümer
                </span>
              )}
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-10 transition"></div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
