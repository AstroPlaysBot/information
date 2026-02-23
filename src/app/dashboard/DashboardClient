'use client';
import { motion } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

interface DashboardClientProps {
  guilds: Guild[];
  user: { username: string; discriminator: string; id: string; avatar?: string };
}

export default function DashboardClient({ guilds, user }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-6 py-16 text-white">
      <div className="flex items-center gap-4 mb-12">
        <img
          src={
            user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
              : '/default-avatar.png'
          }
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-bold text-lg">{user.username}#{user.discriminator}</p>
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-center mb-16 animate-fadeIn">
        Wähle einen Server
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {guilds.map((g) => (
          <motion.button
            key={g.id}
            onClick={() => (window.location.href = `/dashboard/${g.id}`)}
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
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
