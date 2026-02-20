// app/admin/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { checkAdminAccess } from "@/lib/discordAuth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(); // NextAuth Session
  if (!session?.user?.id || !(await checkAdminAccess(session.user.id))) {
    // Kein Zugriff -> Redirect
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 p-8 border-r border-white/10 bg-white/5 backdrop-blur-2xl flex flex-col">
        <h1 className="text-3xl font-extrabold tracking-wide mb-12">Admin Panel</h1>
        <nav className="space-y-4">
          <Link href="/admin" className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
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
