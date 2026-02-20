'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default function DashboardSelectPage() {
  const router = useRouter();

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Token aus URL oder localStorage
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token') || localStorage.getItem('discordAccessToken');
    const discordUserId = params.get('discord_user_id') || localStorage.getItem('discordUserId');

    if (!accessToken || !discordUserId) {
      setError('Bitte zuerst über Discord einloggen.');
      setLoading(false);
      return;
    }

    // Speichern, falls aus URL
    if (params.get('access_token') && params.get('discord_user_id')) {
      localStorage.setItem('discordAccessToken', accessToken);
      localStorage.setItem('discordUserId', discordUserId);
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Guilds holen
    fetch('/api/get-guilds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, discordUserId }),
    })
      .then(res => res.json())
      .then(data => setGuilds(data.guilds ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-white text-2xl">
        Lade Server…
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-center p-4">
        {error}
      </div>
    );

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-80 hidden md:flex flex-col justify-between p-8
                   bg-white/5 backdrop-blur-2xl border-r border-white/10"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide mb-6">🚀 AstroPlays</h1>
          <p className="text-gray-400 leading-relaxed">
            Wähle einen Discord-Server aus, um das Dashboard freizuschalten.
          </p>
        </div>
        <div className="text-sm text-gray-500">Sidebar wird nach Auswahl aktiviert</div>
      </motion.aside>

      {/* Server Grid */}
      <div className="flex-1 flex flex-col p-10 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-10"
        >
          Server auswählen
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 flex-1"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {guilds.map(g => (
            <motion.button
              key={g.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/dashboard/${g.id}`)}
              className="relative group h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              {g.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=512`}
                  alt={g.name}
                  className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-6xl font-bold">
                  {g.name[0]}
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition" />

              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold">{g.name}</h3>
                {g.owner && (
                  <span className="mt-2 inline-block w-fit px-3 py-1 text-xs font-semibold rounded-full bg-purple-600 shadow-lg">
                    Eigentümer
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Status Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => router.push('/dashboard/status')}
          className="mt-10 py-5 rounded-2xl text-xl font-semibold tracking-wide
                     bg-gradient-to-br from-neutral-800 to-neutral-900
                     border border-white/10
                     hover:border-purple-500/50
                     hover:shadow-purple-500/20
                     transition-all"
        >
          STATUS
        </motion.button>
      </div>
    </div>
  );
}
