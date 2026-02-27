'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const discordId = searchParams.get('discord_id');

  if (!discordId) return <p>Fehler: Kein Discord User</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-2xl w-full p-8 bg-neutral-800 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4">Willkommen Admin</h1>
        <p className="mb-6">Bitte wähle, wohin du möchtest:</p>
        <div className="flex gap-4">
          <a
            href="/dashboard"
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Dashboard
          </a>
          <a
            href="/adminboard"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
          >
            Adminboard
          </a>
        </div>
      </div>
    </div>
  );
}
