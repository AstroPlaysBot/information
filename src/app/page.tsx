
'use client';

import React from 'react';
import Background from '../components/Background';

export default function HomePage() {
  const modules = [
    {
      group: 'AstroModeration',
      id: 'astro-moderation', // <- ID für Scrollziel
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
      items: [
        { name: 'Kommt noch...', info: 'Streaming-Features in Arbeit' },
      ],
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
      items: [
        { name: 'AstroTickets+', info: 'Premium Ticketsystem' },
      ],
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <Background />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-start justify-center min-h-screen px-8 max-w-7xl mx-auto">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Play, Manage,<br />Level Up.
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren,
          zu verwalten und auf das nächste Level zu bringen – alles an einem Ort.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-32">
          <a
            href="/concept"
            className="inline-flex items-center justify-center rounded-lg
                       bg-indigo-600 hover:bg-indigo-500 transition
                       text-white font-semibold px-6 py-3"
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
      </section>

      {/* MODULES SECTION */}
      <section className="relative px-8 max-w-7xl mx-auto space-y-32 mt-32">
        {modules.map((group) => (
          <div
            key={group.group}
            id={group.id ? group.id : undefined} // <- ID setzen, falls vorhanden
            className="relative flex flex-col items-center text-center"
          >
            <h2 className="text-4xl font-extrabold text-white mb-12">
              {group.group}
            </h2>

            <div
              className={`
                grid gap-8 z-10 relative
                ${group.items.length === 1
                  ? 'grid-cols-1 justify-items-center'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}
              `}
            >
              {group.items.map((mod) => (
                <div
                  key={mod.name}
                  className="relative overflow-hidden rounded-2xl p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl"
                >
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
      <section 
        id="support"
        className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Support
        </h2>

        <p className="text-gray-300 max-w-3xl mx-auto mb-6 text-lg">
          Du hast Fragen, Probleme oder brauchst Hilfe bei der Nutzung von AstroPlays? 
          Kein Problem! Unser Support-Team steht dir jederzeit zur Verfügung. 
          Schreibe uns eine Mail an <a href="mailto:astroplays.help@gmail.com" className="underline text-indigo-400">astroplays.help@gmail.com</a> 
          oder trete unserem Discord-Server bei, um direkt mit uns zu chatten: 
          <a href="https://discord.gg/jtxQA7jnKa" target="_blank" rel="noopener noreferrer" className="underline text-indigo-400">
            Discord Server
          </a>.
        </p>

        <p className="text-gray-400 max-w-2xl mx-auto text-md">
          Unser Team beantwortet deine Fragen so schnell wie möglich. 
          Bitte gib möglichst detaillierte Informationen zu deinem Anliegen an, 
          damit wir dir effizient helfen können.
        </p>
      </section>
      
      {/* APPLY SECTION */}
      <section 
        id="apply"
        className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Bewerben
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
          Du hast Lust, Teil unseres Teams zu werden und aktiv an AstroPlays
          mitzuwirken? Dann bewirb dich jetzt und gestalte die Zukunft mit uns.
        </p>

        <a
          href="/apply"
          className="inline-flex items-center justify-center
                     rounded-xl bg-indigo-600 hover:bg-indigo-500
                     transition text-white font-semibold
                     px-10 py-4 text-lg shadow-xl hover:shadow-2xl"
        >
          Jetzt bewerben →
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
