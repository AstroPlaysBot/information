'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ApplicationType {
  id: string;
  title: string;
  description: string;
  perks?: string[];
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  created_at: string;
}

const applications: ApplicationType[] = [
  {
    id: 'betatester',
    title: 'Beta Tester',
    description: 'Erhalte Premium kostenlos und teste Module vor Release.',
    perks: ['Frühzugriff auf neue Features', 'Premium kostenlos', 'Mitgestaltung von Features'],
  },
  {
    id: 'moderator',
    title: 'Moderator',
    description: 'Moderation im Discord, z.B. Tickets bearbeiten.',
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Hilf beim Erstellen von Benutzeroberflächen für Dashboards & Webseiten.',
    perks: ['React/Next.js Projekte', 'Design Integration', 'UI/UX Umsetzung'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Entwickle Serverlogik, APIs und Bot-Funktionen.',
    perks: ['Discord Bot APIs', 'Datenbankanbindung', 'Backend-Optimierung'],
  },
];

export default function ApplyPage() {
  const router = useRouter();
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Discord-User über Cookie laden
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          // nicht eingeloggt → Discord OAuth
          window.location.href = '/api/discord-auth?state=/apply';
          return;
        }

        const data = await res.json();
        setDiscordUser(data.user);
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleApply = (appId: string) => {
    router.push(`/apply/${appId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Lädt...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">

      {/* 🔹 Discord Profil */}
      {discordUser && (
        <div className="flex items-center gap-4 mb-8">
          <img
            className="w-12 h-12 rounded-full"
            src={
              discordUser.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                : '/default-avatar.png'
            }
            alt="Avatar"
          />
          <div>
            <p className="font-bold">
              {discordUser.username}#{discordUser.discriminator}
            </p>
            <p className="text-gray-400 text-sm">
              Account erstellt: {new Date(discordUser.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-5xl font-extrabold text-center mb-12 animate-fadeIn">
        Bewirb dich für eine Rolle
      </h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {applications.map((app) => (
          <motion.div
            key={app.id}
            className="bg-gray-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-3">{app.title}</h2>
              <p className="text-gray-300 mb-4">{app.description}</p>

              {app.perks && (
                <ul className="list-disc list-inside text-gray-400 mb-6">
                  {app.perks.map((perk, i) => (
                    <li key={i}>{perk}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => handleApply(app.id)}
              className="mt-4 py-3 px-6 rounded-xl bg-purple-600 hover:bg-pink-600 text-white font-semibold shadow-lg transition-all"
            >
              Bewerben
            </button>
          </motion.div>
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
