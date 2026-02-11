'use client';

import React from 'react';
import Background from '../components/Background';

export default function HomePage() {
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

        <div className="flex items-center gap-4">
          <a
            href="/concept"
            className="inline-flex items-center justify-center rounded-lg
                       bg-indigo-600 hover:bg-indigo-500 transition
                       text-white font-semibold px-6 py-3"
          >
            Zum Konzept
          </a>

          <a
            href="#features"
            className="text-white font-medium hover:underline"
          >
            Funktionen entdecken →
          </a>
        </div>
      </section>

      {/* MODULARE SECTIONS */}
      <section className="max-w-5xl mx-auto py-16 px-4 text-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Modul 1</h2>
        <p className="mb-8">Text für Modul 1</p>

        <h2 className="text-2xl font-semibold mb-4">Modul 2</h2>
        <p>Text für Modul 2</p>

        <h2 className="text-2xl font-semibold mb-4">Support</h2>
        <p>Hier kommt dein Support-Text rein.</p>
      </section>
    </>
  );
}
