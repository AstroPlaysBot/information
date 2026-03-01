// src/app/login/page.tsx
'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const discordId = searchParams.get('discord_id');
  const router = useRouter();

  if (!discordId) {
    // Wenn man manuell /login aufruft → weiterleiten zu OAuth
    if (typeof window !== 'undefined') {
      window.location.href = '/api/discord-auth?state=dashboard';
    }
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-2xl w-full p-8 bg-neutral-800 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4">Willkommen Admin</h1>
        <p className="mb-6">Bitte wähle, wohin du möchtest:</p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/adminboard')}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
          >
            Adminboard
          </button>
        </div>
      </div>
    </div>
  );
}
