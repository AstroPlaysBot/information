// src/app/login/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-2xl w-full p-8 bg-neutral-800 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-6">Wohin möchtest du?</h1>

        <div className="flex gap-6">

          {/* Dashboard */}
          <a
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Dashboard
          </a>

          {/* Adminboard */}
          <a
            href={isAdmin ? "/adminboard" : "#"}
            className={`px-6 py-3 rounded transition ${
              isAdmin
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed opacity-60"
            }`}
          >
            🔒 Adminboard
          </a>

        </div>
      </div>
    </div>
  );
}
