// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

// Server Component
export default async function DashboardSelectPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('discord_token')?.value;

  if (!token) {
    // Kein Token → Weiterleitung auf Login/Startseite
    redirect('/');
  }

  let guilds: Guild[] = [];
  let error: string | null = null;

  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Discord API Fehler');

    const data = await res.json();
    if (!data || data.length === 0) {
      error =
        'Keine Server gefunden. Bitte stelle sicher, dass du mindestens einen Server verwaltest.';
    } else {
      guilds = data;
    }
  } catch (err) {
    console.error('Discord Guild Fetch Error:', err);
    error = 'Fehler beim Laden der Server.';
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white text-center p-6">
        <p className="mb-6 text-red-500">{error}</p>
        <button
          onClick={() => redirect('/')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-pink-600 transition text-white font-semibold"
        >
          Zurück zur Startseite
        </button>
      </div>
    );
  }

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
            onClick={() => redirect(`/dashboard/${g.id}`)}
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
