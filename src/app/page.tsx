'use client';

import React from 'react';
import Background from '../components/Background';

// Beispiel-Icons (du kannst später eigene Bilder/Icons einfügen)
import shieldImg from '../public/shield.png';
import starImg from '../public/star.png';
import boostImg from '../public/boost.png';
import streamImg from '../public/stream.png';
import autoRolesImg from '../public/autoroles.png';

export default function HomePage() {
  const modules = [
    {
      group: 'AstroBasics',
      bgImage: boostImg, // oder anderes Bild
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
      bgImage: shieldImg,
      items: [
        { name: 'AstroLogs', info: 'Server Logs einsehen' },
        { name: 'AstroLock', info: 'Kanäle sperren' },
        { name: 'AstroModeration', info: 'Moderationstools für Admins' },
        { name: 'AstroModlogs', info: 'Moderations-Logs automatisch' },
        { name: 'AstroShield', info: 'Schutz vor Spam & Raid' },
      ],
    },
    {
      group: 'AstroStar (Premium)',
      bgImage: starImg,
      items: [
        { name: 'AstroTickets+', info: 'Premium Ticketsystem' },
      ],
    },
    {
      group: 'AstroStreams',
      bgImage: streamImg,
      items: [
        { name: 'Kommt noch...', info: 'Streaming-Features in Arbeit' },
      ],
    },
  ];

  return (
    <>
      <Background />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-start justify-center min-h-[80vh] px-8 max-w-7xl mx-auto">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Play, Manage,<br />Level Up.
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren,
          zu verwalten und auf das nächste Level zu bringen – alles an einem Ort.
        </p>

        <div className="flex items-center gap-4 mb-32">
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
      <section className="relative px-8 max-w-7xl mx-auto space-y-32">
        {modules.map((group) => (
          <div key={group.group} className="relative flex flex-col items-center text-center">
            {/* Gruppenüberschrift */}
            <h2 className="text-4xl font-extrabold text-white mb-8">
              {group.group}
            </h2>

            {/* Hintergrundbild */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-64 h-64 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url(${group.bgImage.src})` }}
            ></div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
              {group.items.map((mod) => (
                <div
                  key={mod.name}
                  className="bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl p-6 hover:scale-105 transform transition"
                >
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">{mod.name}</h3>
                  <p className="text-gray-300 text-sm">{mod.info}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
