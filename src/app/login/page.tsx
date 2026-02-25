'use client';
import React, { useEffect, useState } from 'react';

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const DISCORD_SCOPE = encodeURIComponent('identify guilds');
const DISCORD_RESPONSE_TYPE = 'code';

function startDiscordAuth(target: 'dashboard' | 'adminboard') {
  if (!DISCORD_CLIENT_ID || !APP_URL) {
    alert('Fehler: Discord Client ID oder App URL fehlt');
    return;
  }

  if (target === 'adminboard') {
    sessionStorage.setItem('admin_attempt', '1');
  }

  const redirectUri = encodeURIComponent(`${APP_URL}/api/discord-auth`);
  const state = target; // 'dashboard' oder 'adminboard'

  const discordAuthUrl =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${DISCORD_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=${DISCORD_RESPONSE_TYPE}` +
    `&scope=${DISCORD_SCOPE}` +
    `&state=${state}`;

  window.location.href = discordAuthUrl;
}

export default function LoginPage() {
  const [adminAllowed, setAdminAllowed] = useState(false);

  // Prüfen, ob der User berechtigt ist (nach OAuth)
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin_token='));
    setAdminAllowed(!!token);
  }, []);

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
          onClick={() => adminAllowed && startDiscordAuth('adminboard')}
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl
                     transition-transform ${adminAllowed ? 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500' : 'cursor-not-allowed bg-gray-700 opacity-50'}`}
        >
          <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
            Adminboard {!adminAllowed && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">
            Bewerbungen, Admin-Funktionen & Verwaltung.
          </p>
        </div>

      </div>
    </div>
  );
}
