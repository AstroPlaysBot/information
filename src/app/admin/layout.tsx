'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminPassword = localStorage.getItem("adminPassword");
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPassword || adminPassword !== envPassword) {
      router.push("/"); 
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-20">Lädt Admin-Dashboard...</p>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <aside className="w-80 p-8 border-r border-white/10 bg-white/5 backdrop-blur-2xl flex flex-col">
        <h1 className="text-3xl font-extrabold tracking-wide mb-12">Admin Panel</h1>
        <nav className="space-y-4">
          <Link
            href="/admin"
            className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            📥 Bewerbungen
          </Link>
        </nav>
        <div className="mt-auto text-xs text-gray-500">AstroPlays © Admin System</div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
