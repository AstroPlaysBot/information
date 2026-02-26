// src/app/login/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // Prüfen via API, ob Token im HTTP-only Cookie vorhanden
    fetch('/api/adminboard')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.allowed);
        setIsUser(true); // jeder User darf Dashboard
      })
      .catch(() => {
        setIsAdmin(false);
        setIsUser(false);
      });
  }, []);

  const navigate = (target: 'dashboard' | 'adminboard') => {
    if ((target === 'dashboard' && isUser) || (target === 'adminboard' && isAdmin)) {
      router.push(target === 'dashboard' ? '/dashboard' : '/adminboard');
      return;
    }
    alert('Kein Zugriff. Discord Auth notwendig.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div onClick={() => navigate('dashboard')} className="cursor-pointer rounded-2xl p-8 shadow-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 hover:scale-105 transition-transform">
          <h2 className="text-3xl font-extrabold text-white mb-4">Dashboard</h2>
          <p className="text-gray-200 text-lg">Konfiguriere deinen Bot für deinen Discord-Server.</p>
        </div>

        <div onClick={() => navigate('adminboard')} className={`rounded-2xl p-8 shadow-2xl transition-transform ${isAdmin ? 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500' : 'cursor-not-allowed bg-gray-700 opacity-50'}`}>
          <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
            Adminboard {!isAdmin && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">Bewerbungen, Admin-Funktionen & Verwaltung.</p>
        </div>
      </div>
    </div>
  );
}
