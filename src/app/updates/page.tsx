import React from 'react';
import Background from '../../components/Background';

export default function UpdatesPage() {
  return (
    <div className="overflow-x-hidden relative min-h-screen">
      <Background />

      <div className="relative pt-32 pb-32 px-6 md:px-8 max-w-6xl mx-auto">

        {/* ── PAGE HEADER ── */}
        <div className="mb-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition text-sm mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Zurück zur Startseite
          </a>

          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
            Latest Update
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-4 tracking-tight">
            The Journey Ahead
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            AstroPlays befindet sich aktuell in der Beta-Phase. Hier siehst du den vollständigen
            Ablauf – von der Bewerbung bis zum offiziellen Launch und darüber hinaus.
          </p>

          {/* Current status badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/25">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
            <span className="text-indigo-300 text-sm font-medium">Aktueller Status: Beta Phase aktiv</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            BETA ROADMAP TIMELINE
        ══════════════════════════════════════════════ */}
        <section className="mb-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-10">Beta-Roadmap</h2>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line – hidden on mobile, visible md+ */}
            <div className="hidden md:block absolute top-[52px] left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-indigo-500/40 to-yellow-500/40 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">

              {/* Step 1 – Beta Bewerbungsphase */}
              <TimelineStep
                phase="-2 Wochen"
                title="Beta Bewerbungsphase"
                status="done"
                dotColor="bg-violet-500"
                borderColor="border-violet-500/30"
                accentColor="text-violet-400"
                description="Bewerbungen für die Beta Phase sind 2 Wochen vor Start möglich."
              />

              {/* Step 2 – Beta Start */}
              <TimelineStep
                phase="Day 0"
                title="Beta Start"
                status="done"
                dotColor="bg-indigo-500"
                borderColor="border-indigo-500/30"
                accentColor="text-indigo-400"
                description="Die Beta Phase beginnt. Alle Beta Tester erhalten ihren Freischalt-Code und können den Bot auf ihren Server einladen."
              />

              {/* Step 3 – Beta Phase (ACTIVE) */}
              <TimelineStep
                phase="2–3 Monate"
                title="Beta Phase"
                status="active"
                dotColor="bg-cyan-400"
                borderColor="border-cyan-400/40"
                accentColor="text-cyan-400"
                description="Testen. Analysieren. Verbessern. Bugs & Verbesserungsvorschläge per Kunden-ID via Mail einsenden. Am Ende: Zusammenfassung mit Vor- & Nachteilen."
                highlight
              />

              {/* Step 4 – Beta Abgeschlossen */}
              <TimelineStep
                phase="Ende Beta"
                title="Beta Abgeschlossen"
                status="upcoming"
                dotColor="bg-yellow-500"
                borderColor="border-yellow-500/20"
                accentColor="text-yellow-400"
                description="Nach Auswertung aller Feedbacks & Analysen wird der Bot für alle User verfügbar."
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            NACH BETA: CORE PASS & ASTRO LEAGUE
        ══════════════════════════════════════════════ */}
        <section className="mb-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-10">Nach der Beta</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CORE PASS */}
            <div className="relative rounded-2xl bg-neutral-900/50 border border-white/[0.07] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
              <div className="p-7">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-400/80">Core Pass</span>
                </div>

                <div className="space-y-0">
                  {[
                    {
                      phase: 'Start',
                      title: 'Core Pass Start',
                      desc: 'Alle Nutzer erhalten den Core Pass für 6 Monate gratis.',
                      color: 'text-green-400',
                      line: true,
                    },
                    {
                      phase: '6 Monate',
                      title: 'Core Pass Aktiv',
                      desc: 'Voller Zugriff auf alle Features, Games & Systeme.',
                      color: 'text-green-400',
                      line: true,
                    },
                    {
                      phase: 'Nach 6 Monaten',
                      title: 'Core Pass Endet',
                      desc: 'Der kostenlose Zugang endet. Ab jetzt sind alle Inhalte kostenpflichtig.',
                      color: 'text-gray-400',
                      line: false,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${item.color === 'text-green-400' ? 'bg-green-500' : 'bg-gray-600'}`} />
                        {item.line && <div className="w-px flex-1 bg-white/[0.06] my-1 min-h-[32px]" />}
                      </div>
                      <div className="pb-5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{item.phase}</span>
                        <div className={`text-sm font-bold mt-0.5 mb-1 ${item.color}`}>{item.title}</div>
                        <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* All Paid */}
                <div className="mt-2 rounded-xl bg-yellow-500/5 border border-yellow-500/15 p-4">
                  <div className="text-yellow-400 font-bold text-sm mb-1">All Paid</div>
                  <div className="text-gray-500 text-xs leading-relaxed">
                    Alle Inhalte, Games & Vorteile sind ab jetzt kostenpflichtig erhältlich.
                  </div>
                </div>
              </div>
            </div>

            {/* ASTRO LEAGUE */}
            <div className="relative rounded-2xl bg-neutral-900/50 border border-white/[0.07] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
              <div className="p-7">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-violet-400/80">Astro League</span>
                </div>

                <div className="space-y-0">
                  {[
                    {
                      phase: 'Start',
                      title: 'Astro League Start',
                      desc: 'Mit Ende der Beta startet die Astro League.',
                      color: 'bg-violet-500',
                      line: true,
                    },
                    {
                      phase: 'Alle 4 Wochen',
                      title: 'Neue Season',
                      desc: 'Neue Season. Neue Herausforderungen. Neue Champions.',
                      color: 'bg-violet-500',
                      line: true,
                    },
                    {
                      phase: 'Dauerhaft',
                      title: 'Astro League bleibt',
                      desc: 'Der Wettbewerb geht weiter – immer & ewig.',
                      color: 'bg-violet-500',
                      line: false,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${item.color}`} />
                        {item.line && <div className="w-px flex-1 bg-white/[0.06] my-1 min-h-[32px]" />}
                      </div>
                      <div className="pb-5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{item.phase}</span>
                        <div className="text-sm font-bold mt-0.5 mb-1 text-violet-300">{item.title}</div>
                        <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 rounded-xl bg-violet-500/5 border border-violet-500/15 p-4">
                  <div className="text-violet-300 font-bold text-sm mb-1">Permanent aktiv</div>
                  <div className="text-gray-500 text-xs leading-relaxed">
                    Die Astro League endet nicht. Jede Season bringt neue Herausforderungen und neue Chancen auf den Titel.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BETA TESTER BELOHNUNGEN
        ══════════════════════════════════════════════ */}
        <section className="mb-16">
          <div className="relative rounded-2xl bg-neutral-900/50 border border-white/[0.07] overflow-hidden p-8 md:p-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Belohnung für Beta Tester</h2>
            <h3 className="text-white font-extrabold text-2xl md:text-3xl tracking-tight mb-8">
              Danke, dass du von Anfang an dabei bist.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="text-white font-bold text-sm mb-2">Alle Premium-Vorteile & Spiele gratis</div>
                <div className="text-gray-500 text-xs leading-relaxed">
                  Für alle Beta Tester, die das Protokoll einhalten und Feedback abgeben, sind alle
                  Premium-Features und Spiele während der Beta-Phase kostenlos verfügbar.
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="text-white font-bold text-sm mb-2">60 % Rabatt für 6 Monate</div>
                <div className="text-gray-500 text-xs leading-relaxed">
                  Nach einem Mindestzeitraum von 6 Monaten als Beta Tester erhältst du weitere 6 Monate
                  lang 60 % Rabatt auf alle Käufe bei AstroPlays.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            WICHTIGER HINWEIS
        ══════════════════════════════════════════════ */}
        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/15 p-5 flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold text-sm mb-1">Wichtiger Hinweis</div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Dieses Konzept befindet sich derzeit in der Planungs- bzw. Beta-Phase. Inhalte, Abläufe sowie
              Vorteile können sich jederzeit ändern, angepasst oder komplett überarbeitet werden. Es handelt
              sich hierbei um ein vorläufiges Konzept, das sich basierend auf Feedback und technischen
              Anforderungen weiterentwickeln wird.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Timeline Step Component ─── */
function TimelineStep({
  phase,
  title,
  status,
  dotColor,
  borderColor,
  accentColor,
  description,
  highlight = false,
}: {
  phase: string;
  title: string;
  status: 'done' | 'active' | 'upcoming';
  dotColor: string;
  borderColor: string;
  accentColor: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      {/* Dot + phase label row */}
      <div className="flex flex-col items-center md:items-start gap-2 mb-4 w-full">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${accentColor}`}>{phase}</span>
        <div className="relative">
          <div className={`w-3.5 h-3.5 rounded-full border-2 ${dotColor.replace('bg-', 'border-')} ${
            status === 'active' ? dotColor + ' shadow-lg shadow-cyan-400/40 animate-pulse' :
            status === 'done'   ? dotColor + ' opacity-80' :
            'bg-neutral-800 border-white/10'
          }`} />
        </div>
      </div>

      {/* Card */}
      <div className={`w-full rounded-2xl border p-5 transition-all duration-300 ${
        highlight
          ? `bg-neutral-900/80 ${borderColor} shadow-lg`
          : `bg-neutral-900/40 ${borderColor}`
      } ${status === 'upcoming' ? 'opacity-50' : ''}`}>
        {status === 'active' && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Aktiv
          </span>
        )}
        {status === 'done' && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-semibold mb-3">
            Abgeschlossen
          </span>
        )}
        {status === 'upcoming' && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-600 text-[10px] font-semibold mb-3">
            Ausstehend
          </span>
        )}
        <h3 className={`font-bold text-base tracking-tight mb-2 ${status === 'upcoming' ? 'text-gray-500' : 'text-white'}`}>
          {title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
