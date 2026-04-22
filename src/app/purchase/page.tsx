'use client';

import { useState, useEffect } from "react";

// ── Simple Icons via CDN (simpleicons.org – CC0 licensed) ──────────────────
const GAME_ICON_SLUGS = {
  Minecraft:            { slug: "minecraft",       hex: "62B47A" },
  Fortnite:             { slug: "fortnite",        hex: "9B59B6" },
  "GTA V":              { slug: "rockstargames",   hex: "FCAF17" },
  "League of Legends":  { slug: "leagueoflegends", hex: "C89B3C" },
  Valorant:             { slug: "valorant",        hex: "FF4655" },
  "Rocket League":      { slug: "rocketleague",    hex: "1B8BE0" },
  "Apex Legends":       { slug: "apexlegends",     hex: "DA292A" },
  "Destiny 2":          { slug: "bungie",          hex: "b0b8c8" },
};

const GameIcon = ({ name, disabled }) => {
  const info = GAME_ICON_SLUGS[name];
  if (!info) return null;
  const hex = disabled ? "444455" : info.hex;
  return (
    <img
      src={`https://cdn.simpleicons.org/${info.slug}/${hex}`}
      alt={name}
      className="w-9 h-9 transition-all duration-300"
      style={{ filter: disabled ? "grayscale(1) opacity(0.3)" : "none" }}
      draggable={false}
    />
  );
};

// ── Game definitions ───────────────────────────────────────────────────────
const GAMES = [
  {
    name: "Minecraft",
    color: "#62B47A",
    glow: "98,180,122",
    tag: "Survival",
    features: [
      "Neuigkeiten & Updates auf deinem Server",
      "Whitelist-Ticketsystem für MC-Server",
      "Server-Status in Echtzeit anzeigen",
      "Automatische Backup-Benachrichtigungen",
    ],
    price: "3,99",
  },
  {
    name: "Fortnite",
    color: "#9B59B6",
    glow: "155,89,182",
    tag: "Battle Royale",
    features: [
      "Täglicher Item-Shop automatisch gepostet",
      "Patch-Notes & Update-Alerts",
      "Turnier-Ankündigungen & FNCS-Tracker",
    ],
    price: "3,99",
  },
  {
    name: "GTA V",
    color: "#FCAF17",
    glow: "252,175,23",
    tag: "Open World",
    features: [
      "Doppel-Belohnungen & Weekly Events",
      "Economy-System für GTA RP-Server",
      "Rockstar Newswire Updates",
      "Heist-Planer & Session-Tools",
    ],
    price: "3,99",
  },
  {
    name: "League of Legends",
    color: "#C89B3C",
    glow: "200,155,60",
    tag: "MOBA",
    features: [
      "Patch-Notes automatisch gepostet",
      "Champion & Skin Release-Alerts",
      "LEC / Worlds Turnier-Tracker",
      "Clash-Erinnerungen für dein Team",
    ],
    price: "3,99",
  },
  {
    name: "Valorant",
    color: "#FF4655",
    glow: "255,70,85",
    tag: "Taktik-Shooter",
    features: [
      "Täglicher Night.Market & Shop-Feed",
      "Patch-Notes & Agent-Releases",
      "VCT Turnier-Benachrichtigungen",
      "Rang-Tracking für Teammitglieder",
    ],
    price: "3,99",
  },
  {
    name: "Rocket League",
    color: "#1B8BE0",
    glow: "27,139,224",
    tag: "Sport",
    features: [
      "Item-Shop täglich automatisch gepostet",
      "Season-Updates & Events",
      "RLCS Turnier-Tracker",
    ],
    price: "3,99",
  },
  {
    name: "Apex Legends",
    color: "#DA292A",
    glow: "218,41,42",
    tag: "Battle Royale",
    features: [
      "Tägliche Map & Care-Package Rotation",
      "Collection-Event & Season-Alerts",
      "ALGS Turnier-Tracker",
      "Legend-Picks & Meta-Updates",
    ],
    price: "3,99",
  },
  {
    name: "Destiny 2",
    color: "#b0b8c8",
    glow: "176,184,200",
    tag: "Looter-Shooter",
    features: [
      "Weekly Reset: Nightfall, Raids & Bounties",
      "Xur Standort & Inventar automatisch",
      "Season-Pass Updates & Events",
    ],
    price: "3,99",
  },
];

// ── Availability via window.storage ────────────────────────────────────────
// Admin sets: { premium: bool, games: { [name]: bool } }
// Use key "availability" — shared so adminboard can write to same key.

const DEFAULT_AVAIL = {
  premium: true,
  games: Object.fromEntries(GAMES.map((g) => [g.name, true])),
};

async function loadAvail() {
  try {
    const res = await window.storage.get("availability");
    if (!res) return DEFAULT_AVAIL;
    const parsed = JSON.parse(res.value);
    // Merge defaults so new games don't break
    return {
      premium: parsed.premium ?? true,
      games: { ...DEFAULT_AVAIL.games, ...parsed.games },
    };
  } catch {
    return DEFAULT_AVAIL;
  }
}

// ── Page component ─────────────────────────────────────────────────────────
export default function PurchasePage() {
  const [hovered, setHovered] = useState(null);
  const [avail, setAvail] = useState(DEFAULT_AVAIL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadAvail().then((d) => { setAvail(d); setReady(true); });
    // Poll every 30s so admin changes are reflected without full reload
    const id = setInterval(() => loadAvail().then(setAvail), 30_000);
    return () => clearInterval(id);
  }, []);

  const premiumOn = avail.premium !== false;
  const gameOn = (name) => avail.games?.[name] !== false;

  return (
    <div className="overflow-x-hidden relative min-h-screen bg-[#06060e]">

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.022) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }} />
        <div className="absolute top-1/3 left-1/5 w-[700px] h-[500px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: "rgba(99,102,241,0.035)" }} />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "rgba(168,85,247,0.03)" }} />
      </div>

      <section className="relative z-10 px-5 md:px-10 max-w-6xl mx-auto pt-28 pb-44">

        {/* ── HEADER ── */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 bg-white/[0.035] border border-white/[0.07] rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-gray-500 text-[11px] font-medium tracking-[0.18em] uppercase">Premium & Spielothek</span>
          </div>

          <h1 className="text-white font-black leading-none mb-5 tracking-tight"
            style={{ fontSize: "clamp(2.8rem,6.5vw,5.5rem)" }}>
            Wähle deinen{" "}
            <span style={{
              background: "linear-gradient(120deg,#818cf8 0%,#c084fc 50%,#f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Power-Up
            </span>
          </h1>
          <p className="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed">
            Alles inklusive mit Premium — oder genau die Spiele die du brauchst.
          </p>
        </div>

        {/* ── PREMIUM CARD ── */}
        <div className="relative mb-24">
          <div className="rounded-3xl p-px" style={{
            background: premiumOn
              ? "linear-gradient(135deg,#6366f1,#a855f7,#ec4899,#6366f1)"
              : "rgba(255,255,255,0.06)",
            backgroundSize: "300% 300%",
            animation: premiumOn ? "gradShift 5s ease infinite" : "none",
          }}>
            <div className="relative rounded-3xl bg-[#06060e] overflow-hidden">
              {premiumOn && (
                <>
                  <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/[0.06] rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/[0.06] rounded-full blur-3xl pointer-events-none" />
                </>
              )}

              <div className="relative p-10 md:p-14">
                {/* UNAVAILABLE OVERLAY */}
                {!premiumOn && (
                  <div className="absolute inset-0 rounded-3xl z-10 flex flex-col items-center justify-center gap-3 bg-[#06060e]/75 backdrop-blur-[2px]">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <p className="text-red-400 font-semibold text-sm">Aktuell nicht verfügbar</p>
                    <p className="text-gray-700 text-xs">Premium ist vorübergehend deaktiviert.</p>
                  </div>
                )}

                <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-10 transition-opacity duration-300 ${!premiumOn ? "opacity-25 pointer-events-none select-none" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1 h-5 rounded-full"
                            style={{ background: "linear-gradient(180deg,#818cf8,#c084fc)", opacity: 1 - i * 0.16 }} />
                        ))}
                      </div>
                      <span className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-[11px]">Premium Plan</span>
                    </div>

                    <h2 className="text-white font-black mb-3 tracking-tight" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>
                      AstroPlays Premium
                    </h2>
                    <p className="text-gray-600 text-sm mb-8 max-w-lg leading-relaxed">
                      Alle Spiele der PLAYS-Kategorie inklusive — solange dein Abo aktiv ist. Plus exklusive Features die kein anderer hat.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        ["Alle PLAYS-Spiele inklusive",        "#818cf8"],
                        ["Minecraft, Fortnite, GTA V & mehr",  "#a78bfa"],
                        ["Neue Spiele automatisch freigeschaltet", "#c084fc"],
                        ["Exklusives AstroTickets+ System",    "#e879f9"],
                        ["Priority Support rund um die Uhr",   "#f472b6"],
                        ["Early Access auf neue Features",     "#fb7185"],
                      ].map(([f, col]) => (
                        <div key={f} className="flex items-center gap-3 bg-white/[0.025] rounded-xl px-4 py-3 border border-white/[0.04]">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col, boxShadow: `0 0 6px ${col}` }} />
                          <span className="text-gray-400 text-[13px]">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-6 shrink-0 md:min-w-[220px]">
                    <div className="md:text-right">
                      <p className="text-gray-700 text-[10px] uppercase tracking-[0.2em] mb-2">Monatlich</p>
                      <div className="flex items-end gap-1">
                        <span className="text-gray-600 text-xl font-bold self-start mt-2">€</span>
                        <span className="text-white font-black leading-none" style={{ fontSize: "3.5rem" }}>11,25</span>
                      </div>
                      <p className="text-gray-700 text-[11px] mt-2">pro Monat · jederzeit kündbar</p>
                    </div>

                    <button
                      disabled={!premiumOn}
                      className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg,#6366f1,#a855f7)",
                        boxShadow: "0 0 28px rgba(99,102,241,0.22)",
                        cursor: premiumOn ? "pointer" : "not-allowed",
                      }}
                    >
                      Jetzt abonnieren →
                    </button>
                    <p className="text-gray-700 text-[11px] text-center w-full">Keine versteckten Kosten</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-6 mb-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <p className="text-gray-700 text-[10px] font-semibold uppercase tracking-[0.22em]">Spielothek</p>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>
        <p className="text-gray-700 text-center mb-12 text-sm">
          Einzelne Module kaufen — einmalig aktiviert, dauerhaft verfügbar.
        </p>

        {/* ── GAME CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {GAMES.map((game) => {
            const on = gameOn(game.name);
            const isH = hovered === game.name && on;

            return (
              <div
                key={game.name}
                onMouseEnter={() => on && setHovered(game.name)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  border: `1px solid ${isH ? game.color + "55" : on ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.025)"}`,
                  background: isH
                    ? `radial-gradient(ellipse at 0% 0%, rgba(${game.glow},0.1) 0%, #07070d 65%)`
                    : "#07070d",
                  boxShadow: isH ? `0 0 28px rgba(${game.glow},0.14), 0 0 65px rgba(${game.glow},0.05)` : "none",
                  transform: isH ? "translateY(-3px)" : "translateY(0)",
                  cursor: on ? "pointer" : "default",
                }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg,transparent,${game.color},transparent)`,
                    opacity: isH ? 1 : 0,
                  }} />

                {/* Ambient blob */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
                  style={{ background: game.color, opacity: isH ? 0.07 : 0 }} />

                <div className="relative p-6 flex flex-col flex-1">

                  {/* UNAVAILABLE OVERLAY */}
                  {!on && (
                    <div className="absolute inset-0 z-20 rounded-2xl bg-[#07070d]/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <p className="text-red-400 text-xs font-semibold">Aktuell nicht verfügbar</p>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300" style={{
                      background: on ? `rgba(${game.glow},0.08)` : "rgba(255,255,255,0.025)",
                      border: `1px solid rgba(${game.glow},${on ? 0.16 : 0.04})`,
                    }}>
                      <GameIcon name={game.name} disabled={!on} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-700 text-[10px] uppercase tracking-widest block mb-0.5">{game.tag}</span>
                      <h3 className={`font-bold text-base leading-tight truncate ${on ? "text-white" : "text-gray-600"}`}>
                        {game.name}
                      </h3>
                      <div className="h-px mt-1.5 rounded-full transition-all duration-500" style={{
                        width: isH ? "100%" : "18px",
                        background: on ? game.color : "#2a2a2a",
                        opacity: 0.6,
                      }} />
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {game.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] leading-relaxed">
                        <div className="w-1 h-1 rounded-full shrink-0 mt-[6px]" style={{
                          background: on ? game.color : "#333",
                          boxShadow: on && isH ? `0 0 4px ${game.color}` : "none",
                        }} />
                        <span className={on ? "text-gray-500" : "text-gray-700 line-through decoration-gray-700/60"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="border-t pt-5 flex items-center justify-between"
                    style={{ borderColor: `rgba(${game.glow},${isH ? 0.16 : 0.05})` }}>
                    <div>
                      <p className="text-gray-700 text-[10px] uppercase tracking-wider mb-0.5">einmalig</p>
                      <p className={`font-black text-xl ${on ? "text-white" : "text-gray-600 line-through decoration-gray-600/60"}`}>
                        {game.price}€
                      </p>
                    </div>

                    <button
                      disabled={!on}
                      className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                      style={{
                        background: !on ? "rgba(255,255,255,0.025)" : isH ? game.color : "rgba(255,255,255,0.06)",
                        color: !on ? "#383838" : isH ? "#000" : "#ccc",
                        border: `1px solid ${!on ? "rgba(255,255,255,0.04)" : isH ? game.color : "rgba(255,255,255,0.09)"}`,
                        boxShadow: isH && on ? `0 0 18px rgba(${game.glow},0.35)` : "none",
                        cursor: on ? "pointer" : "not-allowed",
                        textDecoration: !on ? "line-through" : "none",
                      }}
                    >
                      Kaufen →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-800 text-xs mt-10 tracking-wide">
          Weitere Spiele folgen · Alle Preise inkl. MwSt.
        </p>
      </section>

      <style>{`
        @keyframes gradShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
