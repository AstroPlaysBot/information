'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { label: 'Übersicht', path: '' },
  { label: 'AstroModeration', path: 'moderation' },
  { label: 'AstroProtect', path: 'protect' },
  { label: 'AstroStreams', path: 'streams' },
  { label: 'AstroPLAYS', path: 'plays' },
  { label: 'Premium', path: 'premium' }, // einfach eigenes Label
];

export default function DashboardSidebar() {
  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();
  const pathname = usePathname();

  if (!guildId) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="w-80 border-r border-white/10 flex flex-col justify-between p-6 bg-white/5 backdrop-blur-3xl shadow-2xl"
      >
        <div>
          <h1 className="text-3xl font-extrabold mb-12 animate-fadeIn">🚀 AstroPlays</h1>

          <nav className="space-y-3">
            {sections.map((s) => {
              const url = `/dashboard/${guildId}/${s.path}`;
              const active = pathname?.startsWith(url);

              return (
                <button
                  key={s.label}
                  onClick={() => router.push(url)}
                  className={`w-full px-5 py-3 text-left rounded-xl transition font-medium ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 w-full py-3 rounded-xl text-center font-semibold bg-white/10 hover:bg-purple-600 hover:text-white shadow-lg transition"
        >
          Server wechseln
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
