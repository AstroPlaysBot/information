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

  const handleAdminDashboard = () => {
    const token = localStorage.getItem("discordAccessToken");
    const userId = localStorage.getItem("discordUserId");

    if (!token || !userId) {
      alert('Bitte zuerst über Discord einloggen!');
      return;
    }

    // Optional: checkAdmin via API bevor Push
    fetch('/api/check-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: token, discordUserId: userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.isAdmin) {
          router.push('/admin');
        } else {
          alert('Du hast keine Admin-Rechte!');
        }
      })
      .catch(() => alert('Fehler beim Prüfen der Admin-Rechte.'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dashboard Button */}
        <div
          onClick={handleDashboardLogin}
          className="cursor-pointer rounded-2xl p-8 shadow-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 transition-transform transform hover:scale-105 hover:shadow-3xl text-center"
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">Dashboard</h2>
          <p className="text-gray-200">Login über Discord, um dein Server-Dashboard zu öffnen.</p>
        </div>

        {/* Admin Dashboard Button */}
        <div
          onClick={handleAdminDashboard}
          className="cursor-pointer rounded-2xl p-8 shadow-2xl bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500 transition-transform transform hover:scale-105 hover:shadow-3xl text-center"
        >
          <h2 className="text-3xl font-extrabold text-white mb-4">Admin Dashboard</h2>
          <p className="text-gray-200">Direkter Zugriff auf das Admin-Panel (Admin-Rechte erforderlich).</p>
        </div>
      </div>
    </div>
  );
}
