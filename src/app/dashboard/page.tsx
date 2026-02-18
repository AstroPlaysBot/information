'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface DiscordUser {
  username: string;
  discriminator: string;
  avatar: string;
  id: string;
}

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [user, setUser] = useState<DiscordUser | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) {
      setError('Kein Discord-Login-Code vorhanden. Bitte über den Login-Button anmelden.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch('/api/discord-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setGuilds(data.guilds);
        } else {
          setError(JSON.stringify(data.error));
        }
      } catch (err) {
        setError('Fehler beim Abrufen der Daten');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-white">Lädt...</div>;
  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Benutzerinfo */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <img
            src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-lg"
          />
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400">
              {user?.username}#{user?.discriminator}
            </h1>
            <p className="text-gray-400 mt-1">Hier sind deine Discord-Server</p>
          </div>
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {guilds.map((g) => (
            <div
              key={g.id}
              onClick={() => router.push(`/dashboard/${g.id}`)}
              className="relative cursor-pointer p-6 rounded-xl bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-500 hover:to-indigo-600 transition-transform transform hover:scale-105 shadow-xl hover:shadow-purple-700/50"
            >
              {g.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`}
                  alt={g.name}
                  className="w-16 h-16 rounded-full mb-4 border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-4 flex items-center justify-center text-gray-400 text-xl">
                  🎮
                </div>
              )}
              <h3 className="text-xl font-bold">{g.name}</h3>
              {g.owner && (
                <span className="absolute top-3 right-3 bg-green-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                  Eigentümer
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
