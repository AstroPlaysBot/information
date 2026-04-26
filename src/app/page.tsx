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
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - 88, behavior: 'smooth' });
      }, 200);
    }
  }, []);

  return (
    <div className="overflow-x-hidden relative">
      <Background />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 max-w-7xl mx-auto gap-12">
        <div className="flex flex-col items-start justify-center flex-1">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Play, Manage,<br />
            <span className="text-violet-500">Level Up.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren,
            zu verwalten und auf das nächste Level zu bringen – alles an einem Ort.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="/concept"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold px-7 py-3 shadow-lg shadow-indigo-500/20"
            >
              Zum Konzept
            </a>
            <a href="/features" className="text-gray-400 font-medium hover:text-white transition-colors">
              Funktionen entdecken →
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WARUM ASTROPLAYS?
      ════════════════════════════════════════ */}
      <section className="relative px-6 md:px-8 max-w-7xl mx-auto mt-16 mb-32">
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
            Warum AstroPlays?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-5 mb-4 tracking-tight">
            Alles, was dein Server braucht.<br className="hidden md:block" /> Nichts, was er nicht braucht.
          </h2>
          <p className="text-gray-500 max-w-2xl text-base leading-relaxed">
            Die meisten Discord-Bots machen genau eine Sache – oder versuchen alles und sind dabei unübersichtlich.
            AstroPlays geht einen anderen Weg: modular, klar strukturiert und für echte Communities gebaut.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Modular aufgebaut',
              text: 'Aktiviere nur, was du wirklich brauchst. Kein Bloat, keine unnötigen Berechtigungen – jedes Modul ist unabhängig und gezielt einsetzbar.',
            },
            {
              title: 'Alles in einem Bot',
              text: 'Von Moderation über Gaming-Integration bis zum Ticket-System: AstroPlays ersetzt mehrere Einzellösungen durch ein einheitliches System.',
            },
            {
              title: 'Dashboard-gesteuert',
              text: 'Konfiguriere alles per Klick über das webbasierte Dashboard. Keine Befehle auswendig lernen, kein manuelles Bearbeiten von Konfigurationsdateien.',
            },
            {
              title: 'Aktive Weiterentwicklung',
              text: 'AstroPlays wird kontinuierlich weiterentwickelt. Neue Module, Verbesserungen und Community-Features erscheinen regelmäßig.',
            },
            {
              title: 'Community-first',
              text: 'Features werden direkt aus Nutzerfeedback entwickelt. Was die Community braucht, wird gebaut – nicht was auf dem Papier gut klingt.',
            },
            {
              title: 'Zuverlässig & schnell',
              text: 'AstroPlays läuft auf stabiler Infrastruktur mit hoher Verfügbarkeit. Dein Server-Betrieb wird nicht durch Bot-Ausfälle unterbrochen.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl bg-neutral-900/50 border border-white/[0.06] hover:border-white/[0.12] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-900/70"
            >
              <div className="w-1.5 h-5 rounded-full bg-indigo-500/70 mb-4" />
              <h3 className="text-white font-semibold text-base mb-2 tracking-tight">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SYSTEM — DASHBOARD & ADMINBOARD
      ════════════════════════════════════════ */}
      <section className="relative px-6 md:px-8 max-w-7xl mx-auto mb-32">
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
            System
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-5 mb-4 tracking-tight">
            Dein Server. Deine Kontrolle.
          </h2>
          <p className="text-gray-500 max-w-2xl text-base leading-relaxed">
            AstroPlays kommt mit einem vollständigen webbasierten Steuerungssystem – bestehend aus einem
            Nutzer-Dashboard und einem separaten Admin-Board für Serververantwortliche.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dashboard */}
          <div className="relative rounded-2xl bg-neutral-900/50 border border-white/[0.07] p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400/80">Dashboard</span>
              <h3 className="text-white font-bold text-2xl mt-2 mb-3 tracking-tight">Für jeden Nutzer</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Das Dashboard ist die zentrale Anlaufstelle für alle Mitglieder. Hier siehst du auf einen Blick,
                welche Server du verwaltest, welche Module aktiv sind und kannst grundlegende Einstellungen vornehmen –
                ohne technisches Vorwissen.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Neu bei Discord oder AstroPlays? Kein Problem. Das Dashboard führt dich Schritt für Schritt durch
                die Einrichtung. Jedes Modul ist mit einer kurzen Erklärung versehen, sodass du immer weißt, was du
                gerade konfigurierst und warum.
              </p>
            </div>
            <ul className="space-y-2">
              {[
                'Serverübersicht auf einen Blick',
                'Modul-Aktivierung per Toggle',
                'Einfache Konfiguration ohne Befehle',
                'Geführte Einrichtung für neue Nutzer',
                'Echtzeit-Status aller aktiven Module',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
              >
                Zum Dashboard
              </a>
            </div>
          </div>

          {/* Adminboard */}
          <div className="relative rounded-2xl bg-neutral-900/50 border border-white/[0.07] p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400/80">Admin-Board</span>
              <h3 className="text-white font-bold text-2xl mt-2 mb-3 tracking-tight">Für erfahrene Admins</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Das Admin-Board richtet sich an Serveradministratoren und bietet erweiterte Steuerungsmöglichkeiten,
                die über das normale Dashboard hinausgehen. Hier werden Berechtigungen verwaltet, Logs ausgewertet
                und systemweite Einstellungen vorgenommen.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Erfahrene Admins profitieren von detaillierten Einblicken: Wer hat wann welche Änderungen vorgenommen?
                Welche Module wurden aktiviert oder deaktiviert? Alle Aktionen sind nachvollziehbar protokolliert und
                können gefiltert eingesehen werden.
              </p>
            </div>
            <ul className="space-y-2">
              {[
                'Detaillierte Audit-Logs aller Aktionen',
                'Rollen- und Berechtigungsmanagement',
                'Erweiterte Modul-Konfiguration',
                'Nutzer- und Moderationsverwaltung',
                'Systemweite Statistiken & Berichte',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all text-white font-semibold text-sm"
              >
                Zum Admin-Board
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WORLD LEAGUE
      ════════════════════════════════════════ */}
      <section className="relative px-6 md:px-8 max-w-7xl mx-auto mb-32">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[350px] bg-indigo-600/6 rounded-full blur-3xl" />
        </div>

        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
            World League
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-5 mb-5 tracking-tight leading-tight">
            Kein Turnier. Kein Ende.<br className="hidden md:block" />
            Ein dauerhafter Wettkampf.
          </h2>
          <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
            Die AstroPlays World League ist ein globales, permanentes Wettbewerbssystem –
            gebaut für Discord-Communities, die mehr wollen als nur einen Server.
            Hier zählt jede Aktion, jeder Spieler und jede Entscheidung.
          </p>
        </div>

        {/* Main concept card */}
        <div className="relative rounded-2xl bg-neutral-900/50 border border-white/[0.07] overflow-hidden mb-4">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div>
                <h3 className="text-white font-bold text-lg mb-4 tracking-tight uppercase text-xs text-indigo-400/80 tracking-widest">Das System</h3>
                <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
                  <p>
                    Die World League läuft dauerhaft in Seasons. Es gibt keinen Endpunkt – das System hört nicht auf.
                    Jede Season bringt neue Herausforderungen, neue Gewinner und neue Chancen, sich an die Spitze zu kämpfen.
                    Wer eine Season verpasst, startet in der nächsten neu. Wer konstant dabei ist, baut echten Einfluss auf.
                  </p>
                  <p>
                    Jeder Spieler beeinflusst das Ranking seines Servers. Jede Aktion zählt –
                    Aktivität, Engagement und das Verhalten innerhalb der Community fließen direkt in die Wertung ein.
                    Es gibt keine passive Teilnahme: Wer nicht agiert, verliert Boden.
                  </p>
                  <p>
                    Jeder Server ist eine eigenständige Einheit im Wettbewerb. Er steht und fällt mit seiner Community.
                    Die stärkste Community gewinnt – nicht der lauteste oder größte Server, sondern der aktivste
                    und am besten organisierte.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-4 tracking-tight uppercase text-xs text-indigo-400/80 tracking-widest">Der Champion</h3>
                <div className="space-y-4 text-gray-500 text-sm leading-relaxed mb-6">
                  <p>
                    Am Ende jeder Season steht eine Auszeichnung, die es so auf Discord nicht gibt:
                    Der siegreiche Server wird als <span className="text-white font-semibold">World League Champion</span> tituliert
                    und systemweit innerhalb der AstroPlays-Plattform hervorgehoben.
                  </p>
                  <p>
                    Kein externer Link, keine versteckte Rangliste. Der Champion ist sichtbar –
                    für alle Server und alle Nutzer, die AstroPlays verwenden.
                    Das ist keine Trophäe, die man versteckt. Das ist ein Statement.
                  </p>
                </div>

                {/* Highlight box */}
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-indigo-400/70 mb-3">Season-Ablauf</div>
                  <div className="space-y-3">
                    {[
                      { step: '01', label: 'Season startet', desc: 'Alle Server treten gleichzeitig an.' },
                      { step: '02', label: 'Punkte sammeln', desc: 'Aktivität & Engagement bestimmen das Ranking.' },
                      { step: '03', label: 'Rangliste in Echtzeit', desc: 'Jeder sieht den aktuellen Stand.' },
                      { step: '04', label: 'Champion wird gekrönt', desc: 'Systemweite Auszeichnung des Siegers.' },
                      { step: '05', label: 'Nächste Season beginnt', desc: 'Neue Herausforderungen. Neue Chancen.' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <span className="text-[10px] font-bold text-indigo-500/50 pt-0.5 w-5 flex-shrink-0 tabular-nums">{item.step}</span>
                        <div>
                          <span className="text-gray-300 text-xs font-semibold">{item.label}</span>
                          <span className="text-gray-600 text-xs"> — {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom statement */}
            <div className="border-t border-white/[0.06] pt-8">
              <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                Die World League endet nicht. Sie wartet nicht. Jede Season ist eine neue Gelegenheit,
                zu zeigen, was deine Community wirklich kann – und was sie von allen anderen unterscheidet.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6">
          <a
            href="/world-league/rules"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 active:scale-95 transition-all text-gray-300 hover:text-white font-medium text-sm"
          >
            Teilnahmebedingungen
          </a>
          <a
            href="/world-league/leaderboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
          >
            Rangliste ansehen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SUPPORT
      ════════════════════════════════════════ */}
      <section id="support" className="relative px-8 max-w-3xl mx-auto mt-24 mb-48 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
          Hilfe & Kontakt
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-5 tracking-tight">Support</h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Fragen, Probleme oder Feedback? Wir helfen dir gerne weiter –
          schreib uns direkt per Mail oder tritt unserem Discord bei.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:astroplays.help@gmail.com"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 hover:text-white font-medium text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            astroplays.help@gmail.com
          </a>
          <a
            href="https://discord.gg/jtxQA7jnKa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Discord beitreten
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════
          APPLY
      ════════════════════════════════════════ */}
      <section id="apply" className="relative px-8 max-w-7xl mx-auto mt-24 mb-48 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
          Werde Teil des Teams
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-5 tracking-tight">Bewerben</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Du möchtest aktiv an AstroPlays mitwirken und die Zukunft des Projekts mitgestalten?
          Dann bewirb dich jetzt als Teil unseres Teams.
        </p>
        <a
          href="/apply"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold px-10 py-4 text-base shadow-lg shadow-indigo-500/20"
        >
          Jetzt bewerben →
        </a>
      </section>

      {/* ════════════════════════════════════════
          TEAM
      ════════════════════════════════════════ */}
      <section id="team" className="relative px-8 max-w-7xl mx-auto mt-24 mb-48 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
          Die Menschen dahinter
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-5 tracking-tight">Unser Team</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Lerne die Köpfe hinter AstroPlays kennen – ihr Engagement und ihre Vision machen das Projekt möglich.
        </p>
        <a
          href="/team"
          className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-semibold px-10 py-4 text-base"
        >
          Zum Team →
        </a>
      </section>
    </div>
  );
}
