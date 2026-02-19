'use client';

import { useRouter } from 'next/navigation';

const servers = [
  { id: '123', name: 'Astro Community' },
  { id: '456', name: 'Gaming Lounge' },
];

export default function DashboardSelectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-6">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          🚀 Server auswählen
        </h1>

        <div className="space-y-4">
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => router.push(`/dashboard/${server.id}`)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition font-semibold"
            >
              {server.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
