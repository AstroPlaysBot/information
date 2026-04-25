import React from 'react';
import Background from '../../../components/Background';

export default function AstroStreamingPage() {
  return (
    <div className="overflow-x-hidden relative min-h-screen">
      <Background />

      <div className="relative pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition text-sm mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Zurück zur Startseite
          </a>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-medium uppercase tracking-widest mb-5">
            🎬 Modul-Gruppe
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            AstroStreaming
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Streaming-Integrationen direkt in Discord – für Twitch, YouTube und mehr.
            Benachrichtige deine Community automatisch, sobald ein Stream live geht.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-xl">
          <div className="relative rounded-2xl bg-neutral-900/60 border border-white/[0.07] p-10 text-center">
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-6">
              ⏳
            </div>
            <h2 className="text-white font-bold text-2xl mb-3 tracking-tight">In aktiver Entwicklung</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              AstroStreaming befindet sich aktuell in der Entwicklung. Geplant sind Integrationen
              für Twitch und YouTube – mit automatischen Live-Benachrichtigungen, Rollen-Vergabe
              beim Stream-Start und vielem mehr.
            </p>

            <div className="flex flex-col gap-3 text-left mb-6">
              {[
                'Twitch Live-Benachrichtigungen',
                'YouTube Upload & Livestream Alerts',
                'Automatische Rollen für Streamer',
                'Stream-Statistiken im Discord anzeigen',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-gray-500 text-sm">
                  <span className="text-violet-400/60">○</span>
                  {f}
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs font-medium">
              Bleib gespannt – Updates folgen
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
