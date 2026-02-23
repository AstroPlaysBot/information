'use client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default async function DashboardPage() {
  const token = cookies().get('discord_token')?.value;
  if (!token) redirect('/');

  let guilds: Guild[] = [];
  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` },
    });
    guilds = await res.json();
  } catch (err) {
    console.error(err);
    redirect('/?error=oauth');
  }

  return <DashboardClient guilds={guilds} token={token} />;
}

// ------------------- CLIENT COMPONENT -------------------

interface DashboardClientProps {
  guilds: Guild[];
  token: string;
}

function DashboardClient({ guilds, token }: DashboardClientProps) {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [discriminator, setDiscriminator] = useState<string>('');
  const [accountCreated, setAccountCreated] = useState<string>('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsername(data.username);
        setDiscriminator(data.discriminator);
        setUserAvatar(
          data.avatar
            ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
            : '/default-avatar.png'
        );
        setAccountCreated(new Date(data.created_at || Date.now()).toLocaleDateString());
      } catch (err) {
        console.error('User fetch error', err);
      }
    }
    fetchUser();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-6 py-16 text-white">
      {/* User Info oben links */}
      <div className="flex items-center gap-4 mb-12">
        {userAvatar && <img src={userAvatar} alt="Avatar" className="w-12 h-12 rounded-full" />}
        <div>
          <p className="font-bold text-lg">{username}#{discriminator}</p>
          <p className="text-sm text-gray-400">Account erstellt: {accountCreated}</p>
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-center mb-16 animate-fadeIn">
        Wähle einen Server
      </h1>

      {(!guilds || guilds.length === 0) && (
        <p className="text-white text-center">Keine Server gefunden.</p>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {guilds.map((g) => (
          <motion.button
            key={g.id}
            onClick={() => window.location.href = `/dashboard/${g.id}`}
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
