// app/adminboard/AdminBoardClient.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Application {
  id: string;
  role: 'Beta Tester' | 'Moderator' | 'Frontend Developer' | 'Backend Developer';
  name: string;
  discordId?: string;
  discriminator?: string;
  avatar?: string | null;
  accountCreated?: string;
  age?: string;
  email?: string;
  answers?: Record<string, string>;
  submittedAt?: string;
}

const roleColors: Record<Application['role'], string> = {
  'Beta Tester': 'bg-purple-600',
  'Moderator': 'bg-indigo-600',
  'Frontend Developer': 'bg-green-600',
  'Backend Developer': 'bg-red-600',
};

export default function AdminBoardClient({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [apps] = useState(applications);
  const [filter, setFilter] = useState<'All' | Application['role']>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredApps = filter === 'All' ? apps : apps.filter(a => a.role === filter);

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Dashboard – Bewerbungen</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['All', 'Beta Tester', 'Moderator', 'Frontend Developer', 'Backend Developer'].map(r => (
          <button
            key={r}
            onClick={() => setFilter(r as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === r ? 'bg-white text-gray-900 shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <AnimatePresence>
          {filteredApps.map(app => (
            <motion.div
              key={app.id}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${roleColors[app.role]} bg-opacity-80`}
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <h2 className="text-xl font-bold">{app.role}</h2>
                <span className="text-sm">
                  {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '–'}
                </span>
              </div>

              {expanded === app.id && (
                <div className="p-4 border-t border-gray-700 flex flex-col gap-4">
                  {app.discordId && (
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={app.avatar ? `https://cdn.discordapp.com/avatars/${app.discordId}/${app.avatar}.png` : '/default-avatar.png'}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex flex-col">
                        <a
                          href={`https://discord.com/users/${app.discordId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 font-bold hover:underline"
                        >
                          {app.name}#{app.discriminator}
                        </a>
                        <span className="text-gray-300 text-sm">
                          Account erstellt: {app.accountCreated ? new Date(app.accountCreated).toLocaleDateString() : '–'}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-200 mb-2">
                    <strong>Alter:</strong> {app.age || '–'} | <strong>Email:</strong> {app.email || '–'}
                  </p>

                  <div className="flex flex-col gap-2 text-gray-300">
                    {app.answers && Object.keys(app.answers).length > 0 ? (
                      Object.entries(app.answers).map(([q, a]) => (
                        <div key={q}>
                          <strong>{q}:</strong> {a}
                        </div>
                      ))
                    ) : (
                      <div>Keine Antworten vorhanden.</div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredApps.length === 0 && <p className="text-center text-gray-400 mt-12 text-lg">Keine Bewerbungen für diese Rolle gefunden.</p>}
      </div>
    </div>
  );
}
