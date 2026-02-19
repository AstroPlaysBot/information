// app/dashboard/[guildId]/moderation/page.tsx
'use client';

export default function ModerationPage() {
  return (
    <div className="p-6">
      <h1 className="text-5xl font-extrabold mb-8 animate-fadeIn">🚨 AstroModeration</h1>
      <p className="text-gray-300 mb-6">
        Hier kannst du alle Moderations-Tools deines Servers verwalten: Automoderation, Warnungen, Banns und Logs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Auto-Moderation</h2>
          <p className="text-gray-400 text-sm">Filtert unerwünschte Nachrichten automatisch.</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Warnungen & Banns</h2>
          <p className="text-gray-400 text-sm">Verwalte Strafen für Regelverstöße einfach.</p>
        </div>
      </div>
    </div>
  );
}
