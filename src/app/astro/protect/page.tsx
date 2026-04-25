import React from 'react';
import Background from '../../../components/Background';

const modules = [
  {
    name: 'AstroLogs',
    icon: '📋',
    description:
      'Behalte jederzeit den Überblick. AstroLogs protokolliert alle wichtigen Ereignisse auf deinem Server – von Nachrichtenbearbeitungen bis hin zu Mitgliederbewegungen – in einem übersichtlichen Log-Kanal.',
    features: ['Nachrichten bearbeitet / gelöscht', 'Mitglieder beigetreten / verlassen', 'Rollen- & Kanal-Änderungen', 'Moderationsaktionen'],
  },
  {
    name: 'AstroLock',
    icon: '🔐',
    description:
      'Sperre einzelne Kanäle oder den gesamten Server mit einem einzigen Befehl. Ideal für Notfallsituationen oder geplante Wartungsphasen.',
    features: ['Einzelne Kanäle sperren', 'Server-weiter Lockdown', 'Zeitgesteuerte Entsperrung', 'Grund im Kanal anzeigen'],
  },
  {
    name: 'AstroModeration',
    icon: '⚖️',
    description:
      'Alle klassischen Moderationstools in einem Modul: Ban, Kick, Mute, Warn und Timeout – mit optionalem Grund und direkter DM-Benachrichtigung an den betroffenen Nutzer.',
    features: ['Ban / Kick / Mute / Warn', 'Tempban & Timeout', 'DM-Benachrichtigung', 'Moderation per Slash-Command'],
  },
  {
    name: 'AstroModlogs',
    icon: '📝',
    description:
      'Alle Moderationsaktionen werden automatisch und strukturiert in einem dedizierten Kanal protokolliert. Inkl. Moderator, Grund, Zeitstempel und Dauer.',
    features: ['Automatische Mod-Log-Einträge', 'Moderator & Grund sichtbar', 'Zeitstempel & Dauer', 'Filterbar nach Aktion oder Nutzer'],
  },
  {
    name: 'AstroShield',
    icon: '🛡️',
    description:
      'Aktiver Schutz vor Spam, Raids und schädlichen Inhalten. AstroShield erkennt auffälliges Verhalten automatisch und reagiert sofort – bevor Schaden entsteht.',
    features: ['Anti-Spam & Anti-Raid', 'Automatische Slow-Mode-Aktivierung', 'Link-Filter & Word-Filter', 'Alert bei verdächtiger Aktivität'],
  },
];

export default function AstroProtectPage() {
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
            🔒 Modul-Gruppe
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            AstroProtect
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Schütze deinen Server vor Raids, Spam und schädlichen Inhalten.
            Mit AstroProtect hast du alle Sicherheits- und Moderationstools zur Hand, um schnell und effektiv zu reagieren.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => (
            <div
              key={mod.name}
              className="group relative rounded-2xl bg-neutral-900/60 border border-white/[0.07] hover:border-indigo-500/40 p-6 transition-all duration-300 hover:bg-neutral-800/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-300">
                {mod.icon}
              </div>
              <h2 className="text-white font-bold text-lg mb-2 tracking-tight">{mod.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{mod.description}</p>
              <ul className="space-y-1.5">
                {mod.features.map((f) => (
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
      </div>
    </div>
  );
}
