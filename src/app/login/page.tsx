import { cookies } from 'next/headers';
import { HiLockClosed, HiViewGrid } from 'react-icons/hi';
import { FaUserShield } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const cookieStore = cookies();

  const adminToken = cookieStore.get('admin_token')?.value;
  const userToken = cookieStore.get('user_token')?.value;

  const isAdmin = !!adminToken;
  const isUser = !!userToken;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-purple-950 px-6">
      
      <div className="w-full max-w-5xl text-center">

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-14">
          Willkommen zurück
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          {/* DASHBOARD */}
          <a
            href="/dashboard"
            className={`group rounded-3xl p-10 shadow-2xl transition transform hover:scale-[1.03]
              ${isUser || isAdmin
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700'
                : 'bg-gray-700 opacity-50 pointer-events-none'
              }`}
          >
            <HiViewGrid className="text-6xl text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-white/70 mt-2">User Bereich</p>
          </a>

          {/* ADMIN */}
          <a
            href={isAdmin ? '/adminboard' : undefined}
            onClick={(e) => !isAdmin && e.preventDefault()}
            className={`group rounded-3xl p-10 shadow-2xl transition transform hover:scale-[1.03]
              ${isAdmin
                ? 'bg-gradient-to-br from-emerald-500 to-green-700'
                : 'bg-gray-700 opacity-50 pointer-events-none'
              }`}
          >
            <FaUserShield className="text-6xl text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Adminboard</h2>
            <p className="text-white/70 mt-2">Nur Admins</p>
          </a>

        </div>

      </div>
    </div>
  );
}
