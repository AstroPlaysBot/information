// src/app/login/[token]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LoginPage() {
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [userAllowed, setUserAllowed] = useState(false);
  const router = useRouter();
  const params = useParams(); // Holt [token]

  const token = params?.token;

  // Nur Zugriff, wenn URL ein Token enthält
  useEffect(() => {
    if (!token) {
      router.replace('/'); // Kein Token → weiterleiten
      return;
    }

    const cookies = document.cookie.split('; ');
    const personalToken = cookies.find((c) => c.startsWith('personal_token='));
    const userToken = cookies.find((c) => c.startsWith('user_token='));
    setAdminAllowed(!!personalToken);
    setUserAllowed(!!userToken || !!personalToken);
  }, [token, router]);

  const startDiscordAuth = (target: 'dashboard' | 'adminboard') => {
    if ((target === 'dashboard' && userAllowed) || (target === 'adminboard' && adminAllowed)) {
      router.push(target === 'dashboard' ? '/dashboard' : '/adminboard');
      return;
    }

    // Discord OAuth nur, wenn noch kein Token vorhanden
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    if (!APP_URL || !clientId) return alert('App URL oder Client ID fehlt');

    const redirectUri = encodeURIComponent(`${APP_URL}/api/discord-auth`);
    const scope = encodeURIComponent('identify guilds');
    const state = target;

    const discordAuthUrl =
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&state=${state}`;

    window.location.href = discordAuthUrl;
  };

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
          <p className="text-gray-200 text-lg">Konfiguriere deinen Bot für deinen Discord-Server.</p>
        </div>

        {/* Adminboard */}
        <div
          onClick={() => startDiscordAuth('adminboard')}
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
