// src/app/dashboard/DashboardSidebar.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  closeSidebar?: () => void;
}

export default function DashboardSidebar({ closeSidebar }: Props) {

  const { guildId } = useParams<{ guildId: string }>();
  const router = useRouter();

  if (!guildId) return null;

  return (
    <aside className="w-80 h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-gray-900 to-black shadow-2xl">

      <div>

        <h1
          className="text-3xl font-extrabold mb-10 cursor-pointer hover:text-purple-400"
          onClick={() => router.push(`/dashboard/${guildId}`)}
        >
          🚀 AstroPlays
        </h1>

        <nav className="space-y-3">

          <button
            onClick={() => router.push(`/dashboard/${guildId}`)}
            className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10"
          >
            Übersicht
          </button>

          <button
            onClick={() => router.push(`/dashboard/${guildId}?tab=verwaltung`)}
            className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10"
          >
            Verwaltung
          </button>

          <div className="pt-6 text-gray-500 text-sm">
            Modules
          </div>

          <button className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10">
            AstroModeration
          </button>

          <button className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10">
            AstroProtect
          </button>

          <button className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10">
            AstroStreams
          </button>

          <button className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10">
            AstroPLAYS
          </button>

          <button className="w-full px-5 py-3 text-left rounded-xl hover:bg-white/10">
            Premium
          </button>

        </nav>

      </div>

      <button
        onClick={() => {
          router.push('/dashboard');
          if (closeSidebar) closeSidebar();
        }}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700"
      >
        Server wechseln
      </button>

    </aside>
  );
}
