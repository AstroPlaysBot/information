import React from 'react';
import Background from '../../../components/Background';

const games = [
  {
    name: 'Minecraft',
    icon: '⛏️',
    status: 'Verfügbar',
    statusColor: 'text-green-400',
    statusBg: 'bg-green-400/10 border-green-400/20',
    description:
      'Verwalte deine Minecraft-Whitelist direkt über Discord. Spieler können sich per Befehl für den Server bewerben – Admins genehmigen oder lehnen per Klick ab. Kein manuelles Editieren von Dateien mehr.',
    features: [
      'Whitelist-Bewerbungen über Discord',
      'Admin-Genehmigung per Button',
      'Automatische Benachrichtigung bei Entscheidung',
      'Spieler-Liste jederzeit einsehbar',
    ],
  },
  {
    name: 'GTA V',
    icon: '🏙️',
    status: 'Verfügbar',
    statusColor: 'text-green-400',
    statusBg: 'bg-green-400/10 border-green-400/20',
    description:
      'Ein vollständiges Economy-System für deinen GTA-V-Roleplay-Server. Verwalte Geldbeträge, vergib Gehälter, zeige Kontostände an und integriere das System in deine Roleplay-Struktur.',
    features: [
      'Kontostand anzeigen & verwalten',
      'Geld transferieren zwischen Spielern',
      'Admin-Befehle für Economy-Kontrolle',
      'Roleplay-freundliche Integration',
    ],
  },
  {
    name: 'Fortnite',
    icon: '🎯',
    status: 'Verfügbar',
    statusColor: 'text-green-400',
    statusBg: 'bg-green-400/10 border-green-400/20',
    description:
      'Halte deine Community immer up-to-date: AstroPLAYS sendet automatisch den aktuellen Fortnite-Shop sowie Game-Updates direkt in einen konfigurierten Discord-Kanal.',
    features: [
      'Täglicher Item-Shop automatisch gepostet',
      'Game-Updates & Patch-Notes',
      'Konfigurierbarer Ziel-Kanal',
      'Immer aktuell durch API-Anbindung',
    ],
  },
];

export default function AstroPlaysPage() {
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
            🎮 Modul-Gruppe
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            AstroPLAYS
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            AstroPLAYS ist der Gaming-Teil von AstroPlays – speziell entwickelt, um beliebte Spiele
            direkt in deinen Discord-Server zu integrieren.
          </p>
        </div>

        {/* Konzept Box */}
        <div className="relative rounded-2xl bg-neutral-900/60 border border-white/[0.07] p-8 mb-16 max-w-3xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />
          <h2 className="text-white font-bold text-xl mb-3 tracking-tight">Das Konzept</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Der <span className="text-white font-semibold">PLAYS</span>-Teil von AstroPlays steht für Gaming. Die Idee dahinter:
            Spieler verbringen viel Zeit in Discord – warum also nicht Spiel-Funktionen direkt dort hinbringen?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Ob Minecraft-Whitelist-Verwaltung, GTA-V-Economy oder Fortnite-Shop-Updates – AstroPLAYS verbindet
            dein Lieblingsspiel mit deiner Community, ohne dass Spieler die App wechseln müssen.
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Welche Spiele aktuell verfügbar sind, siehst du in der <span className="text-indigo-400">Spielothek</span> – dort findest du alle verfügbaren Spiele und Premium-Optionen.
          </p>
          <div className="mt-6">
            <a
              href="/purchase"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
            >
              Zur Spielothek →
            </a>
          </div>
        </div>

        {/* Games Grid */}
        <h2 className="text-white font-bold text-2xl tracking-tight mb-6">Aktuell verfügbare Spiele</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <div
              key={game.name}
              className="group relative rounded-2xl bg-neutral-900/60 border border-white/[0.07] hover:border-indigo-500/40 p-6 transition-all duration-300 hover:bg-neutral-800/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium mb-4 ${game.statusBg} ${game.statusColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {game.status}
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-300">
                {game.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 tracking-tight">{game.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{game.description}</p>
              <ul className="space-y-1.5">
                {game.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-400 text-xs">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-indigo-500/5 to-transparent" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">Alle Spiele & Premium-Optionen in der Spielothek</p>
          <a
            href="/purchase"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
          >
            Spielothek öffnen →
          </a>
        </div>
      </div>
    </div>
  );
}
