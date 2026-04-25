import React from 'react';
import Background from '../../../components/Background';

const modules = [
  {
    name: 'AstroAutoRoles',
    icon: '🎭',
    description:
      'Vergib Rollen automatisch, sobald ein Mitglied deinem Server beitritt. Konfiguriere mehrere Standard-Rollen, zeitverzögerte Zuweisung und Bot-Ausnahmen – ohne manuelle Eingriffe.',
    features: ['Mehrere Standard-Rollen konfigurierbar', 'Zeitverzögerte Rollenvergabe', 'Bot-Mitglieder ausschließen', 'Logging der Rollenvergaben'],
  },
  {
    name: 'AstroBoost',
    icon: '🚀',
    description:
      'Belohne Server-Booster automatisch mit Rollen, Nachrichten oder Sonderrechten. Zeige Boosts in Echtzeit an und feiere jeden Boost öffentlich im gewünschten Kanal.',
    features: ['Automatische Boost-Rollen', 'Öffentliche Boost-Ankündigungen', 'Anpassbare Nachrichtenvorlagen', 'Boost-Verlauf einsehbar'],
  },
  {
    name: 'AstroBump',
    icon: '🔔',
    description:
      'Vergiss nie wieder einen Server-Bump. AstroBump erinnert dich automatisch nach dem Ablauf des Bump-Cooldowns und hält deinen Server sichtbar.',
    features: ['Automatische Bump-Erinnerungen', 'Kanal & Mention konfigurierbar', 'Kompatibel mit DISBOARD', 'Statistiken über Bumps'],
  },
  {
    name: 'AstroCall',
    icon: '📞',
    description:
      'Verwalte Voice-Channels professionell. Benachrichtige Mitglieder bei Aktivität, steuere Berechtigungen dynamisch und erhalte Logs über Voice-Ereignisse.',
    features: ['Benachrichtigungen bei Voice-Beitritt', 'Dynamische Berechtigungssteuerung', 'Voice-Event Logs', 'Temporäre Channels erstellen'],
  },
  {
    name: 'AstroClear',
    icon: '🧹',
    description:
      'Lösche Nachrichten schnell und sicher – einzeln, in Mengen oder gefiltert nach Nutzer, Zeitraum oder Inhalt. Ideal für Moderatoren, die schnell handeln müssen.',
    features: ['Bulk-Delete mit Filteroptionen', 'Nach Nutzer filtern', 'Nach Zeitraum filtern', 'Lösch-Logs im Mod-Kanal'],
  },
  {
    name: 'AstroGreeting',
    icon: '👋',
    description:
      'Begrüße neue Mitglieder mit personalisierten Nachrichten – mit Embeds, Bildern oder einfachem Text. Verabschiede Mitglieder automatisch beim Verlassen.',
    features: ['Willkommensnachrichten mit Embed', 'Abschiedsnachrichten', 'Variablen: Name, Mention, Servername', 'DM-Begrüßung möglich'],
  },
  {
    name: 'AstroTickets',
    icon: '🎫',
    description:
      'Ein professionelles Ticket-System direkt in Discord. Nutzer öffnen Tickets per Klick, Moderatoren bearbeiten sie in privaten Kanälen – mit Transkript beim Schließen.',
    features: ['Ticket-Erstellung per Button', 'Private Kanäle pro Ticket', 'Kategorien & Abteilungen', 'Automatisches Transkript beim Schließen'],
  },
];

export default function AstroModerationPage() {
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
            🛡️ Modul-Gruppe
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            AstroModeration
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Das komplette Moderations-Paket für deinen Discord-Server. Automatisiere Rollen, begrüße neue Mitglieder,
            verwalte Tickets und halte deinen Server organisiert – alles an einem Ort.
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
