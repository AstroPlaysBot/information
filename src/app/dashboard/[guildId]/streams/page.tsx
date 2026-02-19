// app/dashboard/[guildId]/streams/page.tsx
'use client';

export default function StreamsPage() {
  return (
    <div className="p-6">
      <h1 className="text-5xl font-extrabold mb-8 animate-fadeIn">🎥 AstroStreams</h1>
      <p className="text-gray-300 mb-6">
        Stream-Tools: Benachrichtigungen, Live-Events und Integration externer Streams.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Live-Benachrichtigungen</h2>
          <p className="text-gray-400 text-sm">Benachrichtige Mitglieder bei Livestreams automatisch.</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-2">Event-Integration</h2>
          <p className="text-gray-400 text-sm">Plane und integriere Streams direkt auf deinem Server.</p>
        </div>
      </div>
    </div>
  );
}
