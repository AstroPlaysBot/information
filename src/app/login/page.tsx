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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-900 px-4">
      <div className="max-w-3xl w-full p-10 bg-neutral-800 rounded-3xl shadow-2xl text-white text-center">
        <h1 className="text-4xl font-extrabold mb-12">Wohin möchtest du?</h1>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          <a
            href="/dashboard"
            className="relative group flex flex-col items-center justify-center px-12 py-6 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl shadow-xl font-bold text-2xl transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <HiViewGrid className="text-5xl mb-3 text-white transition-transform group-hover:rotate-12 duration-500" />
            Dashboard
          </a>

          <a
            href={isAdmin ? '/adminboard' : undefined}
            className={`relative group flex flex-col items-center justify-center px-12 py-6 rounded-2xl shadow-xl font-bold text-2xl transform transition-all ${
              isAdmin
                ? 'bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 hover:shadow-2xl'
                : 'bg-gray-600 cursor-not-allowed opacity-60'
            }`}
          >
            {isAdmin ? (
              <>
                <FaUserShield className="text-5xl mb-3 text-white transition-transform group-hover:rotate-12 duration-500" />
                Adminboard
              </>
            ) : (
              <>
                <HiLockClosed className="text-5xl mb-3 text-white" />
                🔒 Adminboard
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
