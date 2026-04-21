'use client';

import React, { useEffect } from 'react';
import Background from '../components/Background';

export default function HomePage() {

  useEffect(() => {
    const section = sessionStorage.getItem('scrollToSection');
    if (section) {
      sessionStorage.removeItem('scrollToSection');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (!element) return;
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 8;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 200);
    }
  }, []);

  const modules = [
    {
      group: 'AstroModeration',
      id: 'astro-moderation',
      items: [
        { name: 'AstroAutoRoles', info: 'Automatisches Rollenmanagement' },
        { name: 'AstroBoost', info: 'Boost-Funktionen für deinen Server' },
        { name: 'AstroBump', info: 'Server bump Reminder' },
        { name: 'AstroCall', info: 'Voice-Channel Funktionen' },
        { name: 'AstroClear', info: 'Nachrichten löschen leicht gemacht' },
        { name: 'AstroGreeting', info: 'Willkommensnachrichten' },
        { name: 'AstroTickets', info: 'Support-Tickets erstellen' },
      ],
    },
    {
      group: 'AstroProtect',
      items: [
        { name: 'AstroLogs', info: 'Server Logs einsehen' },
        { name: 'AstroLock', info: 'Kanäle sperren' },
        { name: 'AstroModeration', info: 'Moderationstools für Admins' },
        { name: 'AstroModlogs', info: 'Moderations-Logs automatisch' },
        { name: 'AstroShield', info: 'Schutz vor Spam & Raid' },
      ],
    },
    {
      group: 'AstroStreaming',
      items: [{ name: 'Kommt noch...', info: 'Streaming-Features in Arbeit' }],
    },
    {
      group: 'AstroPLAYS',
      items: [
        { name: 'Minecraft', info: 'Whitelist System' },
        { name: 'GTA V', info: 'Economy System' },
        { name: 'Fortnite', info: 'Shop & Game Updates' },
      ],
    },
    {
      group: 'Premium Features',
      items: [{ name: 'AstroTickets+', info: 'Premium Ticketsystem' }],
    },
  ];

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot+applications.commands`

  return (
    <div className="overflow-x-hidden relative">
      <Background />

      {/* HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 max-w-7xl mx-auto gap-12">

        {/* Links — Text */}
        <div className="flex flex-col items-start justify-center flex-1">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-indigo-300 font-medium">Bot ist online</span>
          </div>

          <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Play, Manage,<br />Level Up.
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
            AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren,
            zu verwalten und auf das nächste Level zu bringen – alles an einem Ort.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            <a
              href="/concept"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold px-6 py-3"
            >
              Zum Konzept
            </a>

            <a
              href="/features"
              className="text-white font-medium hover:underline"
            >
              Funktionen entdecken →
            </a>
          </div>
        </div>

        {/* Rechts — Invite Card */}
        <div className="flex-1 flex items-center justify-center lg:justify-end w-full max-w-sm lg:max-w-md">
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">

            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-8 space-y-6">
              {/* Bot Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">AstroPlays</p>
                  <p className="text-gray-400 text-sm">Discord Bot</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Module", value: "15+" },
                  { label: "Befehle", value: "50+" },
                  { label: "Server", value: "bald" },
                  { label: "Uptime", value: "99%" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                    <p className="text-white font-bold text-lg">{value}</p>
                    <p className="text-gray-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-2">
                {[
                  "Moderation & Schutz",
                  "Ticket-System",
                  "Auto-Roles & Greeting",
                  "Gaming-Integrationen",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="text-green-400 text-xs">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              {/* Invite Button */}
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl text-white font-semibold text-base shadow-lg hover:shadow-indigo-500/25"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Bot einladen
              </a>

              <p className="text-center text-xs text-gray-600">
                Kostenlos · Keine Kreditkarte nötig
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="relative px-8 max-w-7xl mx-auto space-y-32 mt-32">
        {modules.map((group) => (
          <div
            key={group.group}
            id={group.id ? group.id : undefined}
            className="relative flex flex-col items-center text-center"
          >
            <h2 className="text-4xl font-extrabold text-white mb-12">{group.group}</h2>
            <div className={`grid gap-8 z-10 relative ${group.items.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {group.items.map((mod) => (
                <div key={mod.name} className="relative overflow-hidden rounded-2xl p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-2xl animate-[gradientMove_8s_linear_infinite]"></div>
                  <div className="relative">
                    <h3 className="text-xl font-semibold text-white mb-2">{mod.name}</h3>
                    <p className="text-gray-200 text-sm">{mod.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* SUPPORT SECTION */}
      <section id="support" className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Support</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-6 text-lg">
          Du hast Fragen, Probleme oder brauchst Hilfe bei der Nutzung von AstroPlays?
          Kein Problem! Unser Support-Team steht dir jederzeit zur Verfügung.
          Schreibe uns eine Mail an <a href="mailto:astroplays.help@gmail.com" className="underline text-indigo-400">astroplays.help@gmail.com</a>
          oder trete unserem Discord-Server bei, um direkt mit uns zu chatten:
          <a href="https://discord.gg/jtxQA7jnKa" target="_blank" rel="noopener noreferrer" className="underline text-indigo-400"> AstroPlays</a>.
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto text-md">
          Unser Team beantwortet deine Fragen so schnell wie möglich.
          Bitte gib möglichst detaillierte Informationen zu deinem Anliegen an,
          damit wir dir effizient helfen können.
        </p>
      </section>

      {/* APPLY SECTION */}
      <section id="apply" className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Bewerben</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
          Du hast Lust, Teil unseres Teams zu werden und aktiv an AstroPlays
          mitzuwirken? Dann bewirb dich jetzt und gestalte die Zukunft mit uns.
        </p>
        <a href="/apply" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold px-10 py-4 text-lg shadow-xl hover:shadow-2xl">
          Jetzt bewerben →
        </a>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Unser Team</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
          Lerne die Hauptpersonen hinter AstroPlays kennen – ihr Engagement, ihre Rollen und Visionen.
        </p>
        <a href="/team" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold px-10 py-4 text-lg shadow-xl hover:shadow-2xl">
          Zum Team →
        </a>
      </section>

      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-[gradientMove_8s_linear_infinite] {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
