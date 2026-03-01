// src/app/login/page.tsx
'use client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { HiLockClosed, HiViewGrid } from 'react-icons/hi';
import { FaUserShield } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const cookieStore = cookies();
  const router = useRouter();

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

          {/* Dashboard Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="relative group flex flex-col items-center justify-center px-12 py-6 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl shadow-xl font-bold text-2xl transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <HiViewGrid className="text-5xl mb-3 text-white transition-transform group-hover:rotate-12 duration-500" />
            Dashboard
            <span className="absolute -bottom-2 left-1/2 w-0 h-1 bg-white rounded-full group-hover:w-1/2 transition-all duration-300 transform -translate-x-1/2"></span>
          </button>

          {/* Adminboard Button */}
          <button
            onClick={() => isAdmin && router.push('/adminboard')}
            disabled={!isAdmin}
            className={`relative group flex flex-col items-center justify-center px-12 py-6 rounded-2xl shadow-xl font-bold text-2xl transform transition-all ${
              isAdmin
                ? "bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 hover:shadow-2xl cursor-pointer"
                : "bg-gray-600 cursor-not-allowed opacity-60"
            }`}
          >
            {isAdmin ? (
              <>
                <FaUserShield className="text-5xl mb-3 text-white transition-transform group-hover:rotate-12 duration-500" />
                Adminboard
                <span className="absolute -bottom-2 left-1/2 w-0 h-1 bg-white rounded-full group-hover:w-1/2 transition-all duration-300 transform -translate-x-1/2"></span>
              </>
            ) : (
              <>
                <HiLockClosed className="text-5xl mb-3 text-white" />
                🔒 Adminboard
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
