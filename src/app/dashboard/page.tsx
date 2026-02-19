'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function DashboardSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [guilds, setGuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;

    fetch('/api/discord-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => setGuilds(data.guilds))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading)
    return <div className="h-screen flex items-center justify-center text-white">Loading…</div>;

  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-14">
        Wähle einen Server
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {guilds.map(g => (
          <button
            key={g.id}
            onClick={() => router.push(`/dashboard/${g.id}`)}
            className="p-6 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition shadow-xl"
          >
            <h3 className="text-xl font-bold">{g.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}
