'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ApplicationType {
  id: string; // für URL
  title: string;
  description: string;
  perks?: string[];
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

  const handleApply = (appId: string) => {
    // Leite zuerst zu Discord OAuth weiter und speichere den redirect
    const redirectUrl = encodeURIComponent(`/apply/${appId}`);
    window.location.href = `/api/discord-auth?redirect=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">
      <h1 className="text-5xl font-extrabold text-center mb-12 animate-fadeIn">
        Bewirb dich für eine Rolle
      </h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {applications.map((app) => (
          <motion.div
            key={app.id}
            className="bg-gray-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
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
    </div>
  );
}
