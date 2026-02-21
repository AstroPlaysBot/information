'use client';
import React from 'react';

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const DISCORD_SCOPE = encodeURIComponent('identify guilds');
const DISCORD_RESPONSE_TYPE = 'code';

/**
 * Startet Discord OAuth und merkt sich,
 * wohin nach dem Login weitergeleitet werden soll
 */
function startDiscordAuth(target: 'dashboard' | 'adminboard') {
  if (!DISCORD_CLIENT_ID || !APP_URL) {
    alert('Fehler: Discord Client ID oder App URL fehlt');
    return;
  }

  const redirectUri = encodeURIComponent(`${APP_URL}/api/discord-auth`);
  const state = target; // <-- WICHTIG

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

        {/* Admin Dashboard */}
        <div
          onClick={() => startDiscordAuth('adminboard')}
          className="relative cursor-pointer overflow-hidden rounded-2xl p-8 shadow-2xl
                     bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500
                     transition-transform hover:scale-105"
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Admin Dashboard
          </h2>
          <p className="text-gray-200 text-lg">
            Bewerbungen, Admin-Funktionen & Verwaltung.
          </p>
        </div>

      </div>
    </div>
  );
}
