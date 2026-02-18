'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Lädt...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Willkommen, {user?.username}#{user?.discriminator}</h1>
      <img
        src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'}
        alt="Avatar"
        className="w-24 h-24 rounded-full mb-6"
      />
      <h2 className="text-2xl font-semibold mb-4">Deine Server</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guilds.map((g) => (
          <div key={g.id} className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold">{g.name}</h3>
            {g.owner && <span className="text-green-400 text-sm">Eigentümer</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
