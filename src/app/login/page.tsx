// src/app/login/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HiLockClosed, HiViewGrid } from 'react-icons/hi';
import { FaUserShield } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const cookieStore = cookies();
  const adminToken = cookieStore.get('admin_token');
  const userToken = cookieStore.get('user_token');

  if (!adminToken && !userToken) {
    redirect('/');
  }

  const isAdmin = !!adminToken;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900 via-indigo-900 to-black px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-12 animate-fadeIn">
        Wohin möchtest du?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">

        {/* Dashboard */}
        <a
          href="/dashboard"
          className="group relative flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl shadow-2xl text-white font-bold text-2xl transition-transform hover:scale-105 hover:shadow-3xl"
        >
          <HiViewGrid className="text-6xl mb-4 transition-transform group-hover:rotate-12" />
          Dashboard
          <p className="mt-2 text-sm text-white/80 font-medium text-center">
            Alle deine Server verwalten & Statistiken sehen
          </p>
        </a>

        {/* Adminboard */}
        <a
          href={isAdmin ? '/adminboard' : undefined}
          onClick={(e) => {
            if (!isAdmin) e.preventDefault()
          }}
          className={`group relative flex flex-col items-center justify-center p-12 rounded-3xl shadow-2xl text-white font-bold text-2xl transition-transform ${
            isAdmin
              ? 'bg-gradient-to-br from-green-500 to-green-700 hover:scale-105 hover:shadow-3xl'
              : 'bg-gray-600 cursor-not-allowed opacity-60'
          }`}
        >
          {isAdmin ? (
            <>
              <FaUserShield className="text-6xl mb-4 transition-transform group-hover:rotate-12" />
              Adminboard
              <p className="mt-2 text-sm text-white/80 font-medium text-center">
                Bewerbungen & Server-Einstellungen verwalten
              </p>
            </>
          ) : (
            <>
              <HiLockClosed className="text-6xl mb-4" />
              🔒 Adminboard
              <p className="mt-2 text-sm text-white/80 font-medium text-center">
                Nur für Admins
              </p>
            </>
          )}
        </a>

      </div>
    </div>
  );
}
