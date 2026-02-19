'use client';
import React from 'react';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-80 p-10 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-gray-900 via-black to-gray-800 opacity-50 backdrop-blur-xl"></div>
        <div className="relative z-10 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
