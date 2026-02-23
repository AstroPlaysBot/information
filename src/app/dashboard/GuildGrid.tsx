// app/dashboard/GuildGrid.tsx
'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default function GuildGrid({ guilds }: { guilds: Guild[] }) {
  const router = useRouter();

  if (!guilds || guilds.length === 0)
    return <p className="text-white text-center">Keine Server gefunden.</p>;

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
