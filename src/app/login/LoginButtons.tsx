// src/app/login/LoginButtons.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAINTENANCE_MODE } from '@/config/maintenance';

export default function LoginButtons({ isUser, isAdmin, username }: any) {
  const router = useRouter();
  const [maintenanceMessage, setMaintenanceMessage] = useState(false);

  const navigate = (target: 'dashboard' | 'adminboard') => {
    if (target === 'dashboard') {
      if (!isUser) return alert('Kein Zugriff. Discord Auth notwendig.');
      if (MAINTENANCE_MODE) {
        setMaintenanceMessage(true);
        return;
      }
      router.push('/dashboard');
      return;
    }

    if (target === 'adminboard') {
      if (!isAdmin) return alert('Kein Zugriff.');
      router.push('/adminboard');
    }
  };

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
        <div
          onClick={() => navigate('dashboard')}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl
            bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600
            transition-transform
            ${!isUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
        >
          <h2 className="text-3xl font-extrabold mb-4">Dashboard</h2>
          <p className="text-gray-200 text-lg">Konfiguriere deinen Bot für deinen Discord-Server.</p>
        </div>

        {/* Adminboard */}
        <div
          onClick={() => navigate('adminboard')}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl transition-transform
            ${isAdmin
              ? 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500'
              : 'cursor-not-allowed bg-gray-700 opacity-50'}`}
        >
          <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
            Adminboard {!isAdmin && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">Bewerbungen, Admin-Funktionen & Verwaltung.</p>
        </div>
      </div>
    </div>
  );
}
