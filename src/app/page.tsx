'use client';

import React from 'react';
import Background from '../components/Background';

export default function HomePage() {
  const modules = [
    {
      group: 'AstroBasics',
      items: [
        { name: 'AstroAutoRoles', info: '' },
        { name: 'AstroBoost', info: '' },
        { name: 'AstroBump', info: '' },
        { name: 'AstroCall', info: '' },
        { name: 'AstroClear', info: '' },
        { name: 'AstroGreeting', info: '' },
        { name: 'AstroTickets', info: '' },
      ],
    },
    {
      group: 'AstroProtect',
      items: [
        { name: 'AstroLogs', info: '' },
        { name: 'AstroLock', info: '' },
        { name: 'AstroModeration', info: '' },
        { name: 'AstroModlogs', info: '' },
        { name: 'AstroShield', info: '' },
      ],
    },
    {
      group: 'AstroStar (Premium)',
      items: [
        { name: 'AstroTickets+', info: '' },
      ],
    },
    {
      group: 'AstroStreams',
      items: [
        { name: 'Kommt noch...', info: '' },
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

        <div className="flex items-center gap-4 mb-12">
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
      <section className="relative px-8 max-w-7xl mx-auto mt-32">
        {/* mt-32 = extra Abstand nach Hero-Section */}
        <h2 className="text-3xl font-bold text-white mb-8">
          Module
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {modules.map((group) => (
            <div key={group.group}>
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">
                {group.group}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {group.items.map((mod) => (
                  <li key={mod.name}>
                    <span className="font-medium">{mod.name}</span>
                    {mod.info && <span>: {mod.info}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
