'use client';

import { useState, useEffect } from "react";

// ── Icons via Iconify CDN ──────────────────────────────────────────────────
const GAME_ICON_SLUGS: Record<string, { slug: string; hex: string }> = {
  Minecraft:            { slug: "simple-icons:minecraft",        hex: "62B47A" },
  Fortnite:             { slug: "simple-icons:epicgames",        hex: "9B59B6" },
  "GTA V":              { slug: "simple-icons:rockstargames",    hex: "FCAF17" },
  "League of Legends":  { slug: "simple-icons:riotgames",       hex: "C89B3C" },
  Valorant:             { slug: "simple-icons:valorant",         hex: "FF4655" },
  // Rocket League & Apex: game-icons.net via Iconify (da simple-icons diese proprietären Logos nicht hat)
  "Rocket League":      { slug: "game-icons:rocket",            hex: "1B8BE0" },
  "Apex Legends":       { slug: "game-icons:targeting",         hex: "DA292A" },
  "Destiny 2":          { slug: "simple-icons:bungie",           hex: "b0b8c8" },
};

const GameIcon = ({ name, disabled }: { name: string; disabled?: boolean }) => {
  const info = GAME_ICON_SLUGS[name];
  if (!info) return null;
  const hex = disabled ? "444455" : info.hex;
  return (
    <img
      src={`https://api.iconify.design/${info.slug}.svg?color=%23${hex}`}
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

// ── Premium features ───────────────────────────────────────────────────────
const PREMIUM_FEATURES = [
  { label: "Alle PLAYS-Spiele inklusive",            color: "#818cf8", idx: 0 },
  { label: "Minecraft, Fortnite, GTA V & mehr",      color: "#a78bfa", idx: 1 },
  { label: "Neue Spiele automatisch freigeschaltet", color: "#c084fc", idx: 2 },
  { label: "Exklusives AstroTickets+ System",        color: "#e879f9", idx: 3 },
  { label: "Priority Support rund um die Uhr",       color: "#f472b6", idx: 4 },
  { label: "Early Access auf neue Features",         color: "#fb7185", idx: 5 },
];

// ── Availability ───────────────────────────────────────────────────────────
const DEFAULT_AVAIL = {
  premium: true,
  games: Object.fromEntries(GAMES.map((g) => [g.name, true])),
};

async function loadAvail() {
  try {
    const res = await fetch("/api/adminboard/availability");
    const data = await res.json();
    if (!data) return DEFAULT_AVAIL;
    return {
      premium: data.premium ?? true,
      games: { ...DEFAULT_AVAIL.games, ...(data.games ?? {}) },
    };
  } catch {
    return DEFAULT_AVAIL;
  }
}

// ── Page component ─────────────────────────────────────────────────────────
export default function PurchasePage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [premiumHovered, setPremiumHovered] = useState(false);
  const [avail, setAvail] = useState(DEFAULT_AVAIL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadAvail().then((d) => { setAvail(d); setReady(true); });
    const id = setInterval(() => loadAvail().then(setAvail), 30_000);
    return () => clearInterval(id);
  }, []);

  const premiumOn = avail.premium !== false;
  const gameOn = (name: string) => avail.games?.[name] !== false;

  return (
    <div className="overflow-x-hidden relative min-h-screen bg-[#06060e]">

      {/* ── GLOBAL ANIMATIONS ── */}
      <style>{`
        @keyframes gradShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }

        /* Jede Feature-Box hat eine einzigartige Phase — sie treffen sich nie */
        @keyframes float0 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          30%     { transform: translateY(-3px) rotate(0.12deg); }
          60%     { transform: translateY(-1.5px) rotate(-0.08deg); }
        }
        @keyframes float1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          25%     { transform: translateY(-2px) rotate(-0.1deg); }
          65%     { transform: translateY(-3.5px) rotate(0.1deg); }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(-2.5px) rotate(0.09deg); }
          70%     { transform: translateY(-1px) rotate(-0.12deg); }
        }
        @keyframes float3 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          20%     { transform: translateY(-1.5px) rotate(-0.08deg); }
          55%     { transform: translateY(-3px) rotate(0.11deg); }
        }
        @keyframes float4 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          35%     { transform: translateY(-3px) rotate(0.1deg); }
          75%     { transform: translateY(-1.5px) rotate(-0.09deg); }
        }
        @keyframes float5 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          45%     { transform: translateY(-2px) rotate(-0.1deg); }
          80%     { transform: translateY(-3.5px) rotate(0.08deg); }
        }

        .feature-float-0 { animation: float0 6.8s ease-in-out infinite; }
        .feature-float-1 { animation: float1 7.6s ease-in-out infinite; }
        .feature-float-2 { animation: float2 6.3s ease-in-out infinite; }
        .feature-float-3 { animation: float3 8.1s ease-in-out infinite; }
        .feature-float-4 { animation: float4 6.6s ease-in-out infinite; }
        .feature-float-5 { animation: float5 7.3s ease-in-out infinite; }

        .feature-box {
          transition: background 0.4s ease, border-color 0.4s ease,
                      box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.34,1.4,0.64,1);
          will-change: transform;
        }

        /* Wenn Premium gehovert: Box zusätzlich nach oben anheben (Float-Animation läuft parallel) */
        .feature-box-lifted {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.07) !important;
        }

        .premium-card-outer {
          transition: transform 0.5s cubic-bezier(0.34,1.15,0.64,1),
                      box-shadow 0.5s ease;
          will-change: transform;
        }
        .premium-card-outer-hovered {
          transform: translateY(-10px) scale(1.013);
          box-shadow: 0 48px 96px rgba(99,102,241,0.2),
                      0 16px 32px rgba(168,85,247,0.1),
                      0 0 0 1px rgba(99,102,241,0.08);
        }
      `}</style>

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
        <div
          className={`relative mb-24 premium-card-outer ${premiumHovered ? "premium-card-outer-hovered" : ""}`}
          onMouseEnter={() => setPremiumHovered(true)}
          onMouseLeave={() => setPremiumHovered(false)}
        >
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
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1 h-5 rounded-full"
                            style={{
                              background: premiumOn
                                ? "linear-gradient(180deg,#818cf8,#c084fc)"
                                : "rgba(255,255,255,0.08)",
                              opacity: 1 - i * 0.16,
                            }} />
                        ))}
                      </div>
                      <span className={`font-bold tracking-[0.2em] uppercase text-[11px] ${premiumOn ? "text-indigo-400" : "text-gray-600"}`}>
                        Premium Plan
                      </span>
                    </div>

                    <h2 className="text-white font-black mb-3 tracking-tight" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>
                      AstroPlays Premium
                    </h2>
                    <p className="text-gray-600 text-sm mb-8 max-w-lg leading-relaxed">
                      Alle Spiele der PLAYS-Kategorie inklusive — solange dein Abo aktiv ist. Plus exklusive Features die kein anderer hat.
                    </p>

                    {/* ── FEATURE BOXES — schweben bei Hover ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PREMIUM_FEATURES.map(({ label, color, idx }) => (
                        <div
                          key={label}
                          className={`feature-box feature-float-${idx} ${premiumHovered ? "feature-box-lifted" : ""} flex items-center gap-3 rounded-xl px-4 py-3`}
                          style={{
                            background: premiumHovered
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(255,255,255,0.025)",
                            border: `1px solid ${premiumHovered ? color + "33" : "rgba(255,255,255,0.04)"}`,
                            // individuelle Verzögerung damit sie gestaffelt abheben
                            transitionDelay: premiumHovered ? `${idx * 30}ms` : "0ms",
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                            background: premiumOn ? color : "#333",
                            boxShadow: premiumOn ? `0 0 ${premiumHovered ? 10 : 6}px ${color}` : "none",
                            transition: "box-shadow 0.4s ease",
                          }} />
                          <span className="text-gray-400 text-[13px]">{label}</span>
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

                    {/* Premium Button */}
                    <div className="w-full flex flex-col items-stretch gap-1.5">
                      <button
                        disabled={!premiumOn}
                        className="w-full py-4 rounded-2xl font-bold text-base"
                        style={premiumOn ? {
                          background: "linear-gradient(135deg,#6366f1,#a855f7)",
                          boxShadow: premiumHovered
                            ? "0 0 44px rgba(99,102,241,0.5), 0 0 16px rgba(168,85,247,0.35)"
                            : "0 0 28px rgba(99,102,241,0.22)",
                          color: "#fff",
                          cursor: "pointer",
                          transform: premiumHovered ? "scale(1.04)" : "scale(1)",
                          transition: "transform 0.3s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.3s ease",
                        } : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "#555",
                          cursor: "not-allowed",
                          textDecoration: "line-through",
                          textDecorationColor: "#666",
                          transition: "none",
                        }}
                      >
                        Jetzt abonnieren →
                      </button>
                      {!premiumOn && (
                        <p className="text-[11px] text-red-500/70 text-center">aktuell nicht verfügbar</p>
                      )}
                      <p className="text-gray-700 text-[11px] text-center">Keine versteckten Kosten</p>
                    </div>
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
            const isH = hovered === game.name;

            return (
              <div
                key={game.name}
                onMouseEnter={() => setHovered(game.name)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  border: `1px solid ${isH && on ? game.color + "55" : "rgba(255,255,255,0.055)"}`,
                  background: isH && on
                    ? `radial-gradient(ellipse at 0% 0%, rgba(${game.glow},0.1) 0%, #07070d 65%)`
                    : "#07070d",
                  boxShadow: isH && on ? `0 0 28px rgba(${game.glow},0.14), 0 0 65px rgba(${game.glow},0.05)` : "none",
                  transform: isH ? "translateY(-3px)" : "translateY(0)",
                  cursor: "default",
                }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg,transparent,${game.color},transparent)`,
                    opacity: isH && on ? 1 : 0,
                  }} />

                {/* Ambient blob */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
                  style={{ background: game.color, opacity: isH && on ? 0.07 : 0 }} />

                <div className="relative p-6 flex flex-col flex-1">

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300" style={{
                      background: `rgba(${game.glow},0.08)`,
                      border: `1px solid rgba(${game.glow},0.16)`,
                    }}>
                      <GameIcon name={game.name} disabled={!on} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-700 text-[10px] uppercase tracking-widest block mb-0.5">{game.tag}</span>
                      <h3 className="font-bold text-base leading-tight truncate text-white">
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
                        <span className="text-gray-500">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="border-t pt-5 flex items-start justify-between"
                    style={{ borderColor: `rgba(${game.glow},${isH && on ? 0.16 : 0.05})` }}>
                    <div>
                      <p className="text-gray-700 text-[10px] uppercase tracking-wider mb-0.5">einmalig</p>
                      <p className="font-black text-xl text-white">
                        {game.price}€
                      </p>
                    </div>

                    {/* Game Button — nur Button gesperrt wenn deaktiviert */}
                    <div className="flex flex-col items-end gap-1">
                      <button
                        disabled={!on}
                        className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={on ? {
                          background: isH ? game.color : "rgba(255,255,255,0.06)",
                          color: isH ? "#000" : "#ccc",
                          border: `1px solid ${isH ? game.color : "rgba(255,255,255,0.09)"}`,
                          boxShadow: isH ? `0 0 18px rgba(${game.glow},0.35)` : "none",
                          cursor: "pointer",
                        } : {
                          background: "rgba(255,255,255,0.04)",
                          color: "#555",
                          border: "1px solid rgba(255,255,255,0.06)",
                          cursor: "not-allowed",
                          textDecoration: "line-through",
                          textDecorationColor: "#666",
                          textDecorationStyle: "solid",
                        }}
                      >
                        Kaufen
                      </button>
                      {!on && (
                        <p className="text-[11px] text-red-500/70">nicht verfügbar</p>
                      )}
                    </div>
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
    </div>
  );
}
