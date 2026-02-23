'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Application {
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

interface Props {
  applications: Application[];
}

export default function AdminBoardClient({ applications }: Props) {
  const [filter, setFilter] = useState<'All' | Application['role']>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredApps =
    filter === 'All' ? applications : applications.filter((a) => a.role === filter);

  const roleColors: Record<Application['role'], string> = {
    'Beta Tester': 'bg-purple-600',
    'Moderator': 'bg-indigo-600',
    'Frontend Developer': 'bg-green-600',
    'Backend Developer': 'bg-red-600',
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Dashboard – Bewerbungen</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['All', 'Beta Tester', 'Moderator', 'Frontend Developer', 'Backend Developer'].map((r) => (
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

      {/* Bewerbungen */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <AnimatePresence>
          {filteredApps.map((app) => (
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
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          app.avatar
                            ? `https://cdn.discordapp.com/avatars/${app.discordId}/${app.avatar}.png`
                            : '/default-avatar.png'
                        }
                        alt="Avatar"
                        className="w-12 h-12 rounded-full"
                      />
                      <p className="text-blue-400 font-bold hover:underline cursor-pointer">
                        <a
                          href={`https://discord.com/users/${app.discordId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {app.name}#{app.discriminator}
                        </a>
                      </p>
                      <p className="text-gray-300 text-sm ml-auto">
                        Account erstellt: {app.accountCreated ? new Date(app.accountCreated).toLocaleDateString() : '–'}
                      </p>
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

                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 transition">
                      Akzeptieren
                    </button>
                    <button className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 transition">
                      Ablehnen
                    </button>
                    <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition">
                      Details kopieren
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredApps.length === 0 && (
          <p className="text-center text-gray-400 mt-12 text-lg">Keine Bewerbungen für diese Rolle gefunden.</p>
        )}
      </div>
    </div>
  );
}
