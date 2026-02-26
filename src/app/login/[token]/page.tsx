// src/app/login/[token]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LoginPage() {
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [userAllowed, setUserAllowed] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params?.token;

  useEffect(() => {
    // Nur Zugriff, wenn Token in URL vorhanden
    if (!token) {
      router.replace('/');
      return;
    }

    // Prüfen, welche Cookies gesetzt sind
    const cookies = document.cookie.split('; ');
    const personalToken = cookies.find((c) => c.startsWith('personal_token='));
    const userToken = cookies.find((c) => c.startsWith('user_token='));
    setAdminAllowed(!!personalToken);
    setUserAllowed(!!userToken || !!personalToken);
  }, [token, router]);

  const navigate = (target: 'dashboard' | 'adminboard') => {
    // Wenn bereits Token vorhanden → direkt weiter
    if ((target === 'dashboard' && userAllowed) || (target === 'adminboard' && adminAllowed)) {
      router.push(target === 'dashboard' ? '/dashboard' : '/adminboard');
      return;
    }
    alert('Kein Token vorhanden. Discord Auth notwendig.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Dashboard */}
        <div
          onClick={() => navigate('dashboard')}
          className="relative cursor-pointer overflow-hidden rounded-2xl p-8 shadow-2xl
                     bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600
                     transition-transform hover:scale-105"
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">Dashboard</h2>
          <p className="text-gray-200 text-lg">Konfiguriere deinen Bot für deinen Discord-Server.</p>
        </div>

        {/* Adminboard */}
        <div
          onClick={() => navigate('adminboard')}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl
                     transition-transform ${
                       adminAllowed
                         ? 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500'
                         : 'cursor-not-allowed bg-gray-700 opacity-50'
                     }`}
        >
          <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
            Adminboard {!adminAllowed && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">Bewerbungen, Admin-Funktionen & Verwaltung.</p>
        </div>

      </div>
    </div>
  );
}
