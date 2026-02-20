'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const roles = [
  {
    id: 'beta-tester',
    title: 'Beta Tester',
    desc: 'Teste neue Module vor allen anderen – kostenlos Premium.',
  },
  {
    id: 'moderator',
    title: 'Moderator',
    desc: 'Hilf beim Aufbau und der Moderation unseres Discord Servers.',
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    desc: 'Next.js, UX, moderne Interfaces.',
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    desc: 'APIs, Security, Datenbanken.',
  },
];

export default function ApplyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-16 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <h1 className="text-5xl font-extrabold mb-12">Offene Positionen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {roles.map(r => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.04 }}
            onClick={() => router.push(`/apply/${r.id}`)}
            className="cursor-pointer p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition"
          >
            <h2 className="text-3xl font-bold mb-4">{r.title}</h2>
            <p className="text-gray-400">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
