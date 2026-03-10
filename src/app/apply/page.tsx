'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ApplicationType {
  id: string;
  title: string;
  description: string;
  perks?: string[];
}

const applications: ApplicationType[] = [
  {
    id: 'moderator',
    title: 'Moderator',
    description: 'Moderiere den Discord Server und unterstütze User bei Problemen.',
    perks: ['Team Zugang', 'Community Einfluss', 'Moderations Tools'],
  },
  {
    id: 'betatester',
    title: 'Beta Tester',
    description: 'Teste neue Features vor dem Release.',
    perks: ['Premium kostenlos', 'Early Access', 'Feature Feedback'],
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Arbeite an Dashboards und Webinterfaces.',
    perks: ['Next.js Projekte', 'UI Entwicklung', 'Teamarbeit'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Entwickle APIs, Bots und Serverlogik.',
    perks: ['API Entwicklung', 'Bot Systeme', 'Database Design'],
  },
  {
    id: 'promotion-manager',
    title: 'Promotion Manager',
    description: 'Hilf den Bot bekannter zu machen und kümmere dich um Social Media.',
    perks: ['Marketing Erfahrung', 'Community Reichweite'],
  },
  {
    id: 'intern',
    title: 'Praktikant',
    description: 'Lerne alle Bereiche kennen und finde deinen Schwerpunkt.',
    perks: ['Einblick in Entwicklung', 'Mentoring', 'Erfahrung sammeln'],
  },
];

export default function ApplyPage() {
  const [errorToast, setErrorToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const toast = sessionStorage.getItem('apply_error_toast');
    if (toast) {
      setErrorToast(JSON.parse(toast));
      sessionStorage.removeItem('apply_error_toast');
      const timer = setTimeout(() => setErrorToast(null), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Join the Team</h1>
        <p className="text-gray-400">
          Werde Teil unseres Teams und hilf dabei den Bot weiterzuentwickeln.
        </p>
      </div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {applications.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl"
          >
            <div>
              <h2 className="text-2xl font-bold mb-3">{app.title}</h2>
              <p className="text-gray-400 mb-6">{app.description}</p>
              {app.perks && (
                <ul className="space-y-1 text-sm text-gray-500 mb-6">
                  {app.perks.map((perk, i) => (
                    <li key={i}>• {perk}</li>
                  ))}
                </ul>
              )}
            </div>

            <a
              href={`/api/discord-auth-apply?state=/apply/${app.id}`}
              className="mt-auto py-3 rounded-xl bg-purple-600 hover:bg-pink-600 text-center font-semibold transition"
            >
              Bewerben
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-red-600 px-4 py-2 rounded shadow-lg flex items-center gap-4"
          >
            <span>{errorToast.message}</span>
            <button
              onClick={() => setErrorToast(null)}
              className="ml-2 font-bold hover:text-gray-200"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
