// src/app/login/LoginButtons.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MAINTENANCE_MODE } from '@/config/maintenance';

interface LoginButtonsProps {
  isUser: boolean;
  isAdmin: boolean;
  username?: string;
}

export default function LoginButtons({ isUser = false, isAdmin = false, username = '' }: LoginButtonsProps) {
  const [maintenanceMessage, setMaintenanceMessage] = useState(false);

  // 🔹 Fallback: render keine Hooks bedingt, alles vorher initialisieren
  const dashboardLink = isUser ? '/dashboard' : '';
  const adminLink = isAdmin ? '/adminboard' : '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 text-white">
      {isUser && username && (
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Willkommen {username}</h1>
          <p className="text-gray-400">Wähle einen Bereich</p>
        </div>
      )}

      {maintenanceMessage && (
        <div className="mb-8 bg-yellow-600 text-black px-6 py-4 rounded-xl text-center max-w-xl">
          <h2 className="font-bold text-xl mb-2">Dashboard Wartungsmodus</h2>
          <p>Die Dashboard Funktionen sind aktuell nicht erreichbar.</p>
          <p className="mt-2">
            Mehr Infos auf Discord:{' '}
            <a
              href="https://discord.gg/3cvhBBm87G"
              target="_blank"
              className="underline font-semibold"
            >
              Hier klicken
            </a>
          </p>
        </div>
      )}

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Dashboard */}
        <Link
          href={dashboardLink || '#'}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl
            bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600
            transition-transform
            ${!isUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
        >
          <h2 className="text-3xl font-extrabold mb-4">Dashboard</h2>
          <p className="text-gray-200 text-lg">Konfiguriere deinen Bot für deinen Discord-Server.</p>
        </Link>

        {/* Adminboard */}
        <Link
          href={adminLink || '#'}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl
            transition-transform
            ${!isAdmin ? 'opacity-50 cursor-not-allowed bg-gray-700' : 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500'}`}
        >
          <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
            Adminboard {!isAdmin && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">Bewerbungen, Admin-Funktionen & Verwaltung.</p>
        </Link>
      </div>
    </div>
  );
}
