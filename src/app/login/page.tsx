'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  function startDiscordAuth(target: 'dashboard' | 'adminboard') {
    // 👉 OAuth IMMER über die API starten
    router.push(`/api/discord-auth?state=${target}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Dashboard */}
        <div
          onClick={() => startDiscordAuth('dashboard')}
          className="relative cursor-pointer overflow-hidden rounded-2xl p-8 shadow-2xl
                     bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600
                     transition-transform hover:scale-105"
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">Dashboard</h2>
          <p className="text-gray-200 text-lg">
            Konfiguriere deinen Bot für deinen Discord-Server.
          </p>
        </div>

        {/* Adminboard */}
        <div
          onClick={() => startDiscordAuth('adminboard')}
          className="relative cursor-pointer overflow-hidden rounded-2xl p-8 shadow-2xl
                     bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500
                     transition-transform hover:scale-105"
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Adminboard
          </h2>
          <p className="text-gray-200 text-lg">
            Bewerbungen, Admin-Funktionen & Verwaltung.
          </p>
        </div>

      </div>
    </div>
  );
}
