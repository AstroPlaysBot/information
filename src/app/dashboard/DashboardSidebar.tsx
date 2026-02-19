'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Übersicht', path: '' },
  { label: 'Einstellungen', path: 'settings' },
  { label: 'Moderation', path: 'moderation' },
  { label: 'Logs', path: 'logs' },
];

export default function DashboardSidebar() {
  const { guildId } = useParams<{ guildId: string }>();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-72 border-r border-white/10 p-6 backdrop-blur-xl bg-white/5">
      <h1 className="text-2xl font-extrabold mb-10 tracking-wide">
        🚀 AstroPlays
      </h1>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const fullPath = `/dashboard/${guildId}/${item.path}`;
          const active = pathname === fullPath || (item.path === '' && pathname === `/dashboard/${guildId}`);

          return (
            <button
              key={item.label}
              onClick={() => router.push(fullPath)}
              className={`w-full text-left px-4 py-3 rounded-xl transition
                ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
