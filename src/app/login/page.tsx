'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleDashboardLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!clientId || !appUrl) {
      alert(
        'Fehler: Discord Client ID oder App URL ist nicht gesetzt! Bitte überprüfe deine Environment-Variablen.'
      );
      return;
    }

    const redirectUri = encodeURIComponent(`${appUrl}/api/discord-auth`);
    const scope = encodeURIComponent('identify guilds');
    const responseType = 'code';

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = discordAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div
        onClick={handleDashboardLogin}
        className="cursor-pointer rounded-2xl p-8 shadow-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 transition-transform transform hover:scale-105 hover:shadow-3xl"
      >
        <h2 className="text-3xl font-extrabold text-white mb-4">Dashboard Login</h2>
        <p className="text-gray-200 text-lg">
          Klicke hier, um dich über Discord einzuloggen und dein Dashboard zu öffnen.
        </p>
      </div>
    </div>
  );
}
