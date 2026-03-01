// src/app/adminboard/AdminBoardClient.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Application {
  id: string;
  role: 'Beta Tester' | 'Moderator' | 'Frontend Developer' | 'Backend Developer';
  name: string;
  age: string;
  email: string;
  answers: Record<string, string>;
  submittedAt: string;
}

const roleColors: Record<Application['role'], string> = {
  'Beta Tester': 'bg-purple-600',
  'Moderator': 'bg-indigo-600',
  'Frontend Developer': 'bg-green-600',
  'Backend Developer': 'bg-red-600',
};

export default function AdminBoardClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | Application['role']>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/adminboard')
      .then(res => res.json())
      .then(data => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, []);

  const filteredApps =
    filter === 'All'
      ? applications
      : applications.filter(a => a.role === filter);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center text-white text-2xl">
        Lade Bewerbungen…
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Admin Dashboard – Bewerbungen
      </h1>

      {/* Dein komplettes Design bleibt exakt gleich */}
      {/* (Rest unverändert wie von dir gepostet) */}
    </div>
  );
}
