// app/dashboard/[guildId]/protect/page.tsx
'use client';

export default function ProtectPage() {
  return (
    <div className="p-6">
      <h1 className="text-5xl font-extrabold mb-8 animate-fadeIn">🛡️ AstroProtect</h1>
      <p className="text-gray-300 mb-6">
        Schutzmodule deines Servers: Anti-Spam, Anti-Raid und Rollen-Schutz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Anti-Spam</h2>
          <p className="text-gray-400 text-sm">Stoppt wiederholte Nachrichten und Spam-Links.</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Anti-Raid</h2>
          <p className="text-gray-400 text-sm">Verhindert Massenbeitritte von Bots oder Spam-Accounts.</p>
        </div>
      </div>
    </div>
  );
}
