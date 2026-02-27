// src/app/login/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAINTENANCE_MODE } from '@/config/maintenance';

export default function LoginPage() {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState(false);

  useEffect(() => {
    fetch('/api/check-session')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.isAdmin);
        setIsUser(data.isUser);
        setUsername(data.username || null);
      })
      .catch(() => {
        setIsAdmin(false);
        setIsUser(false);
        setUsername(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const navigate = (target: 'dashboard' | 'adminboard') => {
    if (target === 'dashboard') {
      if (!isUser) {
        alert('Kein Zugriff. Discord Auth notwendig.');
        return;
      }

      if (MAINTENANCE_MODE) {
        setMaintenanceMessage(true);
        return;
      }

      router.push('/dashboard');
      return;
    }

    if (target === 'adminboard') {
      if (!isAdmin) {
        alert('Kein Zugriff.');
        return;
      }

      router.push('/adminboard');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Lade...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 text-white">

      {/* 🔹 Willkommen Bereich */}
      {isUser && username && (
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-2">
            Willkommen {username}
          </h1>
          <p className="text-gray-400">
            Wähle einen Bereich
          </p>
        </div>
      )}

      {/* 🔹 Wartungsmodus Meldung */}
      {maintenanceMessage && (
        <div className="mb-8 bg-yellow-600 text-black px-6 py-4 rounded-xl text-center max-w-xl">
          <h2 className="font-bold text-xl mb-2">
            Dashboard Wartungsmodus
          </h2>
          <p>
            Die Dashboard Funktionen sind aktuell nicht erreichbar.
          </p>
          <p className="mt-2">
            Mehr Infos auf Discord:{' '}
            <a
              href="DEIN_DISCORD_LINK"
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
          <p className="text-gray-200 text-lg">
            Konfiguriere deinen Bot für deinen Discord-Server.
          </p>
        </div>

        {/* Adminboard */}
        <div
          onClick={() => navigate('adminboard')}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl transition-transform ${
            isAdmin
              ? 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500'
              : 'cursor-not-allowed bg-gray-700 opacity-50'
          }`}
        >
          <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
            Adminboard {!isAdmin && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">
            Bewerbungen, Admin-Funktionen & Verwaltung.
          </p>
        </div>

      </div>
    </div>
  );
}
