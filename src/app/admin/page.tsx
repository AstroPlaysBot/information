'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const mockApplications = [
  {
    id: '1',
    name: 'Max Mustermann',
    role: 'Moderator',
    status: 'open',
    createdAt: 'vor 2 Stunden',
  },
  {
    id: '2',
    name: 'Lisa Schmidt',
    role: 'Support',
    status: 'claimed',
    claimedBy: 'Admin#1234',
    createdAt: 'gestern',
  },
];

export default function AdminInbox() {
  const router = useRouter();
  const [apps, setApps] = useState(mockApplications);

  const claim = (id: string) => {
    setApps(apps.map(a =>
      a.id === id ? { ...a, status: 'claimed', claimedBy: 'Du' } : a
    ));
  };

  return (
    <>
      {/* Intro Animation */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-10"
      >
        Bewerbungen
      </motion.h1>

      <div className="space-y-6">
        {apps.map(app => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition cursor-pointer"
            onClick={() => router.push(`/admin/applications/${app.id}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{app.name}</h3>
                <p className="text-gray-400 text-sm">
                  Bewerbung als {app.role} · {app.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {app.status === 'open' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      claim(app.id);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition text-sm"
                  >
                    Claim
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 text-sm">
                    Geclaimed von {app.claimedBy}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
