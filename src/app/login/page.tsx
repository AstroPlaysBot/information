import { cookies } from 'next/headers';
import { HiLockClosed, HiViewGrid } from 'react-icons/hi';
import { FaUserShield } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const cookieStore = cookies();
  const adminToken = cookieStore.get('admin_token');
  const userToken = cookieStore.get('user_token');

  const isAdmin = !!adminToken;
  const isUser = !!userToken;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-purple-950 px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
      </div>

      {/* Title */}
      <h1 className="relative text-4xl md:text-6xl font-extrabold text-white text-center mb-14 tracking-tight">
        Wähle deinen Bereich
        <p className="text-sm md:text-base text-white/60 font-normal mt-3">
          Login erkannt – Zugriff wird automatisch angepasst
        </p>
      </h1>

      {/* Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">

        {/* DASHBOARD */}
        <a
          href="/dashboard"
          className={`
            group relative p-10 rounded-3xl border border-white/10
            backdrop-blur-xl shadow-2xl transition-all duration-300
            hover:scale-[1.03] hover:shadow-indigo-500/30
            ${isUser || isAdmin
              ? 'bg-white/5 hover:bg-white/10'
              : 'bg-white/5 opacity-50 cursor-not-allowed'
            }
          `}
        >
          <div className="flex flex-col items-center text-center text-white">

            <div className="p-4 rounded-2xl bg-indigo-500/20 mb-5 group-hover:bg-indigo-500/30 transition">
              <HiViewGrid className="text-5xl" />
            </div>

            <h2 className="text-2xl font-bold">Dashboard</h2>

            <p className="text-sm text-white/60 mt-2">
              Server verwalten, Statistiken & Tools
            </p>

            {!isUser && !isAdmin && (
              <span className="mt-4 text-xs text-red-300">
                Kein Zugriff
              </span>
            )}

          </div>
        </a>

        {/* ADMINBOARD */}
        <a
          href={isAdmin ? '/adminboard' : undefined}
          onClick={(e) => {
            if (!isAdmin) e.preventDefault();
          }}
          className={`
            group relative p-10 rounded-3xl border border-white/10
            backdrop-blur-xl shadow-2xl transition-all duration-300
            hover:scale-[1.03]
            ${isAdmin
              ? 'bg-white/5 hover:bg-emerald-500/10 hover:shadow-emerald-500/30'
              : 'bg-white/5 opacity-50 cursor-not-allowed'
            }
          `}
        >
          <div className="flex flex-col items-center text-center text-white">

            <div className={`
              p-4 rounded-2xl mb-5 transition
              ${isAdmin
                ? 'bg-emerald-500/20 group-hover:bg-emerald-500/30'
                : 'bg-white/10'
              }
            `}>
              {isAdmin ? (
                <FaUserShield className="text-5xl" />
              ) : (
                <HiLockClosed className="text-5xl" />
              )}
            </div>

            <h2 className="text-2xl font-bold">
              Adminboard
            </h2>

            <p className="text-sm text-white/60 mt-2">
              Bewerbungen & System Einstellungen
            </p>

            {!isAdmin && (
              <span className="mt-4 text-xs text-gray-400">
                Nur für Administratoren
              </span>
            )}

          </div>
        </a>

      </div>
    </div>
  );
}
