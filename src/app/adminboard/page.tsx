'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Application {
  id: string;
  role: 'Beta Tester' | 'Moderator' | 'Frontend Developer' | 'Backend Developer';
  name: string;
  age: string;
  email: string;
  answers: Record<string, string>;
  submittedAt: string;
}

export default function AdminBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/adminboard')
      .then(res => res.json())
      .then(data => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex justify-center items-center text-white text-2xl">Lade Bewerbungen…</div>;

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <h1 className="text-4xl font-extrabold mb-12 text-center">Admin Dashboard – Bewerbungen</h1>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {applications.map(app => (
          <motion.div
            key={app.id}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">{app.role}</h2>
            <p className="text-gray-300 mb-2"><strong>Name:</strong> {app.name} | <strong>Alter:</strong> {app.age} | <strong>Email:</strong> {app.email}</p>
            <div className="flex flex-col gap-1 text-gray-200">
              {Object.entries(app.answers).map(([q, a]) => (
                <div key={q}>
                  <strong>{q}:</strong> {a}
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-400">Eingereicht: {new Date(app.submittedAt).toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
