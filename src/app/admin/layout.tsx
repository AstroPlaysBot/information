// app/admin/layout.tsx
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
    // AccessToken vom Discord-Login aus localStorage
    const accessToken = localStorage.getItem("discordAccessToken");
    if (!accessToken) {
      router.push("/"); // Kein Token -> raus
      return;
    }

    // Prüfen, ob User Admin ist
    fetch("/api/check-admin", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.isAdmin) router.push("/"); // Kein Admin -> raus
        else setLoading(false); // Admin -> Dashboard laden
      })
      .catch(() => router.push("/"));
  }, [router]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-20">Lädt Admin-Dashboard...</p>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Sidebar */}
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

      {/* Content */}
      <main className="flex-1 p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
