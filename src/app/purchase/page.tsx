'use client';

import React from 'react';
import Background from '../../components/Background';

export default function PurchasePage() {
  const games = [
    {
      name: 'Minecraft',
      emoji: '⛏️',
      features: [
        'Neuigkeiten & Updates direkt auf deinem Server',
        'Whitelist-Ticketsystem für deinen MC-Server',
      ],
      price: '3,99',
    },
    {
      name: 'Fortnite',
      emoji: '🎯',
      features: [
        'Aktueller Fortnite-Shop täglich angezeigt',
      ],
      price: '3,99',
    },
    {
      name: 'GTA V',
      emoji: '🚗',
      features: [
        'Aktuelle Doppel-Belohnungs-Events & Heists',
        'Economy-System für GTA V Roleplays (PS4/PS5)',
      ],
      price: '3,99',
    },
  ];

  return (
    <div className="overflow-x-hidden relative min-h-screen">
      <Background />

      <section className="relative px-8 max-w-5xl mx-auto pt-32 pb-48">
        <div className="text-center mb-16">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            Premium & Spielothek
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Wähle deinen Plan oder erweitere deinen Server mit einzelnen Spiel-Modulen.
          </p>
        </div>

        {/* PREMIUM CARD */}
        <div className="relative mb-20">
          {/* Animated border via pseudo-element approach using wrapper */}
          <div className="premium-glow-wrapper rounded-3xl p-px">
            <div className="relative rounded-3xl bg-gray-950 overflow-hidden">
              {/* Inner glow blobs */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative p-10 md:p-14">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-5">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-indigo-300 text-sm font-semibold tracking-wide uppercase">Premium</span>
                    </div>

                    <h2 className="text-white text-4xl font-extrabold mb-3">AstroPlays Premium</h2>
                    <p className="text-gray-400 text-base mb-8 max-w-lg">
                      Alle Spiele der PLAYS-Kategorie inklusive — solange dein Abo aktiv ist. Plus exklusive Features die kein anderer hat.
                    </p>

                    <ul className="space-y-3">
                      {[
                        '✦ Exklusives AstroTickets+ Ticketsystem',
                        '✦ Alle aktuellen & kommenden PLAYS-Spiele inklusive',
                        '✦ Minecraft, Fortnite, GTA V & mehr',
                        '✦ Neue Spiele automatisch freigeschaltet',
                        '✦ Priority Support',
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-gray-200 text-sm">
                          <span className="text-indigo-400 font-bold">{f.slice(0, 1)}</span>
                          <span>{f.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                    <div className="text-center md:text-right">
                      <p className="text-gray-500 text-sm mb-1">Monatlich</p>
                      <p className="text-white text-5xl font-extrabold">11,25€</p>
                      <p className="text-gray-500 text-xs mt-1">pro Monat · jederzeit kündbar</p>
                    </div>
                    <button className="w-full md:w-auto mt-2 px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition text-white font-bold text-base shadow-xl hover:shadow-indigo-500/30">
                      Jetzt abonnieren →
                    </button>
                    <p className="text-gray-600 text-xs text-center">Keine versteckten Kosten</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-white/10" />
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Spielothek</p>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <p className="text-gray-400 text-center mb-10 text-base">
          Oder kaufe einzelne Spiel-Module für deinen Server — einmalig aktiviert, dauerhaft verfügbar.
        </p>

        {/* GAME CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.name}
              className="relative rounded-2xl border border-white/10 bg-gray-900/80 overflow-hidden flex flex-col"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative p-7 flex flex-col flex-1">
                <div className="text-4xl mb-4">{game.emoji}</div>
                <h3 className="text-white text-xl font-bold mb-3">{game.name}</h3>

                <ul className="space-y-2 flex-1 mb-6">
                  {game.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-5 flex items-center justify-between">
                  <p className="text-white font-extrabold text-2xl">{game.price}€</p>
                  <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white font-semibold text-sm border border-white/10">
                    Kaufen →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-10">
          Weitere Spiele folgen in Kürze · Preise inkl. MwSt.
        </p>
      </section>

      <style jsx global>{`
        @keyframes borderRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .premium-glow-wrapper {
          background: linear-gradient(
            270deg,
            #6366f1,
            #a855f7,
            #ec4899,
            #6366f1
          );
          background-size: 400% 400%;
          animation: borderRotate 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
