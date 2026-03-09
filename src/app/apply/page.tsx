'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ApplicationType {
  id: string;
  title: string;
  description: string;
  perks?: string[];
}

const applications: ApplicationType[] = [
  { id: 'betatester', title: 'Beta Tester', description: 'Erhalte Premium kostenlos und teste Module vor Release.', perks: ['Frühzugriff auf neue Features', 'Premium kostenlos', 'Mitgestaltung von Features'] },
  { id: 'moderator', title: 'Moderator', description: 'Moderation im Discord, z.B. Tickets bearbeiten.' },
  { id: 'frontend-developer', title: 'Frontend Developer', description: 'Hilf beim Erstellen von Benutzeroberflächen für Dashboards & Webseiten.', perks: ['React/Next.js Projekte', 'Design Integration', 'UI/UX Umsetzung'] },
  { id: 'backend-developer', title: 'Backend Developer', description: 'Entwickle Serverlogik, APIs und Bot-Funktionen.', perks: ['Discord Bot APIs', 'Datenbankanbindung', 'Backend-Optimierung'] },
];

export default function ApplyPage() {
  const [errorToast, setErrorToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    // Prüfen, ob ein Fehler von OAuth zurückkam
    const toastStr = sessionStorage.getItem('apply_error_toast');
    if (toastStr) {
      const toast = JSON.parse(toastStr);
      setErrorToast(toast);
      sessionStorage.removeItem('apply_error_toast');

      setTimeout(() => setErrorToast(null), 10000); // nach 10s ausblenden
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">
      <h1 className="text-5xl font-extrabold text-center mb-12 animate-fadeIn">
        Bewirb dich für eine Rolle
      </h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
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
                  {app.perks.map((perk, i) => (<li key={i}>{perk}</li>))}
                </ul>
              )}
            </div>
            <a
              href={`/api/discord-auth-apply?state=/apply/${app.id}`}
              className="mt-4 inline-block py-3 px-6 rounded-xl bg-purple-600 hover:bg-pink-600 text-white font-semibold shadow-lg transition-all text-center"
            >
              Bewerben
            </a>
          </motion.div>
        ))}
      </motion.div>

      {errorToast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg flex items-center gap-4 bg-red-600 text-white transition-opacity duration-500">
          {errorToast.message}
          <button className="font-bold" onClick={() => setErrorToast(null)}>×</button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
      `}</style>
    </div>
  );
}
