'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const REDIRECT_URI = APP_URL ? encodeURIComponent(`${APP_URL}/dashboard`) : '';
const DISCORD_SCOPE = encodeURIComponent('identify guilds'); 
const DISCORD_RESPONSE_TYPE = 'code';

export default function LoginPage() {
  const router = useRouter();

  const handleDashboardLogin = () => {
    if (!DISCORD_CLIENT_ID || !APP_URL) {
      alert('Fehler: Discord Client ID oder App URL ist nicht gesetzt!');
      return;
    }

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${DISCORD_RESPONSE_TYPE}&scope=${DISCORD_SCOPE}`;
    window.location.href = discordAuthUrl;
  };

  const handleAdminClick = () => {
    const password = prompt("Bitte Admin Passwort eingeben:");
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("adminPassword", password);
      router.push("/admin");
    } else {
      alert("Falsches Passwort!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div
          onClick={handleDashboardLogin}
          className="relative cursor-pointer overflow-hidden rounded-2xl p-8 shadow-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 transition-transform transform hover:scale-105 hover:shadow-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-[gradientMove_8s_linear_infinite]"></div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-4">Dashboard</h2>
            <p className="text-gray-200 text-lg">
              Konfiguriere deinen Bot für deinen Discord-Server, alles an einem Ort.
            </p>
          </div>
        </div>

        <div
          onClick={handleAdminClick}
          className="relative cursor-pointer overflow-hidden rounded-2xl p-8 shadow-2xl bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500 transition-transform transform hover:scale-105 hover:shadow-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 opacity-30 blur-3xl animate-[gradientMove_8s_linear_infinite]"></div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-4">Admin Dashboard</h2>
            <p className="text-gray-200 text-lg">
              Überblick über Bewerbungen, Verwaltung von Mitgliedern und Server-Rollen.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-[gradientMove_8s_linear_infinite] { background-size: 200% 200%; }
      `}</style>
    </div>
  );
}
