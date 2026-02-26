// src/app/login/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Serverseitig prüfen, ob Cookies gesetzt sind
    fetch('/api/check-session')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.isAdmin);
        setIsUser(data.isUser);
      })
      .catch(() => {
        setIsAdmin(false);
        setIsUser(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const navigate = (target: 'dashboard' | 'adminboard') => {
    if ((target === 'dashboard' && isUser) || (target === 'adminboard' && isAdmin)) {
      router.push(target === 'dashboard' ? '/dashboard' : '/adminboard');
      return;
    }
    alert('Kein Zugriff. Discord Auth notwendig.');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Lade...</div>;

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
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl transition-transform ${
            isAdmin
              ? 'cursor-pointer hover:scale-105 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500'
              : 'cursor-not-allowed bg-gray-700 opacity-50'
          }`}
        >
          <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
            Adminboard {!isAdmin && <span className="text-lg">🔒</span>}
          </h2>
          <p className="text-gray-200 text-lg">Bewerbungen, Admin-Funktionen & Verwaltung.</p>
        </div>

      </div>
    </div>
  );
}
