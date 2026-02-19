'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';

const sections = [
  { label: 'Übersicht', path: '' },
  {
    label: 'AstroModeration',
    path: 'moderation',
  },
  {
    label: 'AstroProtect',
    path: 'protect',
  },
  {
    label: 'AstroStreams',
    path: 'streams',
  },
  {
    label: 'AstroPLAYS',
    path: 'plays',
  },
];

export default function Sidebar() {
  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-72 border-r border-white/10 p-6 bg-white/5 backdrop-blur-xl">
      <h1 className="text-2xl font-extrabold mb-10">🚀 AstroPlays</h1>

      <nav className="space-y-2">
        {sections.map(s => {
          const url = `/dashboard/${guildId}/${s.path}`;
          const active = pathname === url || pathname === `/dashboard/${guildId}`;

          return (
            <button
              key={s.label}
              onClick={() => router.push(url)}
              className={`w-full px-4 py-3 rounded-xl text-left transition ${
                active
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
