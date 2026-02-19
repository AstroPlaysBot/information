// app/dashboard/[guildId]/plays/page.tsx
'use client';

export default function PlaysPage() {
  return (
    <div className="p-6">
      <h1 className="text-5xl font-extrabold mb-8 animate-fadeIn">🎮 AstroPLAYS</h1>
      <p className="text-gray-300 mb-6">
        Spiele & Interaktive Module: Minispiele, Level-Systeme und Belohnungen für deine Community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Minispiele</h2>
          <p className="text-gray-400 text-sm">Verschiedene Spiele für deine Mitglieder direkt auf Discord.</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Level & Belohnungen</h2>
          <p className="text-gray-400 text-sm">Belohne aktive Mitglieder automatisch.</p>
        </div>
      </div>
    </div>
  );
}
