'use client';
import DashboardSidebar from './DashboardSidebar';

export default function GuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        {/* Optionaler futuristischer Hintergrund */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-gray-900 via-black to-gray-800 opacity-60"></div>

        {/* Content Container */}
        <div className="relative z-10 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
