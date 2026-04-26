import React from 'react';
import Background from '../../../components/Background';

const sections = [
  {
    number: '01',
    title: 'Geltungsbereich',
    content: [
      'Diese Teilnahmebedingungen gelten für alle Discord-Server und deren Mitglieder, die an der AstroPlays World League (nachfolgend "World League") teilnehmen.',
      'Mit der Anmeldung zur World League erklärt sich der Serveradministrator sowie alle teilnehmenden Mitglieder mit diesen Bedingungen einverstanden.',
      'AstroPlays behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen werden rechtzeitig bekannt gegeben.',
    ],
  },
  {
    number: '02',
    title: 'Teilnahmevoraussetzungen',
    content: [
      'Teilnahmeberechtigt sind alle Discord-Server, auf denen der AstroPlays-Bot aktiv installiert und konfiguriert ist.',
      'Der teilnehmende Server muss zum Zeitpunkt der Anmeldung mindestens 10 aktive Mitglieder vorweisen.',
      'Pro Discord-Server ist eine einmalige Anmeldung pro Season möglich. Mehrfachanmeldungen desselben Servers sind nicht zulässig.',
      'Serveradministratoren sind für die Einhaltung dieser Bedingungen durch alle Mitglieder ihres Servers verantwortlich.',
    ],
  },
  {
    number: '03',
    title: 'Season-Betrieb & Punktevergabe',
    content: [
      'Die World League läuft dauerhaft in Seasons. Jede Season hat eine definierte Laufzeit, die zu Beginn der jeweiligen Season bekannt gegeben wird.',
      'Punkte werden durch Aktivität, Community-Engagement und die Teilnahme an Season-spezifischen Challenges vergeben.',
      'Die genaue Gewichtung der Punktekategorien wird zu Beginn jeder Season transparent kommuniziert und gilt für die gesamte Dauer der Season unveränderlich.',
      'AstroPlays behält sich vor, bei technischen Störungen oder außergewöhnlichen Ereignissen korrigierend in die Punkteverteilung einzugreifen.',
    ],
  },
  {
    number: '04',
    title: 'Fair Play & verbotenes Verhalten',
    content: [
      'Jegliche Form von Manipulation der Rangliste, des Punktesystems oder anderer Wettbewerbskomponenten ist strikt untersagt.',
      'Das gezielte Erstellen von Fake-Accounts, automatisierten Bots oder sonstigen Mitteln zur künstlichen Aktivitätssteigerung führt zum sofortigen Ausschluss.',
      'Absprachen zwischen mehreren Servern zum gegenseitigen Vorteil innerhalb des Wettbewerbs sind nicht zulässig.',
      'Beleidigungen, Diskriminierung oder Harassment gegenüber anderen Teilnehmern – ob innerhalb oder außerhalb der World League – können zum Ausschluss führen.',
      'AstroPlays entscheidet im Zweifelsfall abschließend über Verstöße gegen die Fair-Play-Regeln. Diese Entscheidungen sind bindend.',
    ],
  },
  {
    number: '05',
    title: 'Ausschluss & Disqualifikation',
    content: [
      'AstroPlays behält sich das Recht vor, Server oder einzelne Mitglieder ohne Vorwarnung von der World League auszuschließen, sofern ein schwerwiegender Regelverstoß vorliegt.',
      'Bei einem Ausschluss verfallen sämtliche gesammelten Punkte der laufenden Season. Eine Rückerstattung oder Übertragung ist nicht möglich.',
      'Disqualifizierte Server können frühestens in der übernächsten Season erneut teilnehmen. AstroPlays entscheidet über Ausnahmen im Einzelfall.',
      'Ein Einspruch gegen eine Disqualifikationsentscheidung kann innerhalb von 7 Tagen per E-Mail an astroplays.help@gmail.com eingereicht werden.',
    ],
  },
  {
    number: '06',
    title: 'Belohnungen & Champion-Titel',
    content: [
      'Der Server mit den meisten Punkten am Ende einer Season wird als World League Champion ausgezeichnet und systemweit innerhalb der AstroPlays-Plattform hervorgehoben.',
      'Belohnungen sind nicht übertragbar, nicht in Bargeld auszahlbar und an den jeweiligen Server sowie dessen aktive Mitglieder gebunden.',
      'AstroPlays behält sich vor, Art und Umfang der Belohnungen je Season anzupassen. Änderungen werden rechtzeitig vor Saisonbeginn kommuniziert.',
      'Im Falle eines Punktegleichstands entscheidet AstroPlays nach festgelegten Kriterien (u. a. Aktivitätszeitraum, Qualität des Engagements) über die Platzierung.',
    ],
  },
  {
    number: '07',
    title: 'Datenschutz & Datenverarbeitung',
    content: [
      'Im Rahmen der World League werden Aktivitätsdaten der teilnehmenden Server und Mitglieder verarbeitet, um die Rangliste zu berechnen und anzuzeigen.',
      'Öffentlich in der Rangliste angezeigte Daten beschränken sich auf Servernamen, Platzierung und Punktestand.',
      'Eine Weitergabe personenbezogener Daten an Dritte findet nicht statt. Es gelten die allgemeinen Datenschutzbestimmungen von AstroPlays.',
      'Durch die Teilnahme an der World League stimmen Serveradministratoren der Verarbeitung der genannten Daten im Rahmen des Wettbewerbs zu.',
    ],
  },
  {
    number: '08',
    title: 'Haftungsausschluss',
    content: [
      'AstroPlays übernimmt keine Haftung für technische Ausfälle, Datenverluste oder sonstige Störungen, die den Wettbewerbsbetrieb beeinträchtigen.',
      'Im Falle eines unvorhergesehenen Abbruchs einer Season behält sich AstroPlays vor, die Season zu annullieren, zu verlängern oder unter geänderten Bedingungen fortzuführen.',
      'AstroPlays haftet nicht für Schäden, die durch die Teilnahme an der World League oder durch das Verhalten anderer Teilnehmer entstehen.',
    ],
  },
  {
    number: '09',
    title: 'Sonstiges',
    content: [
      'Die World League ist ein dauerhaftes System ohne festes Enddatum. AstroPlays behält sich das Recht vor, den Betrieb der World League jederzeit einzustellen oder grundlegend zu überarbeiten.',
      'Sollten einzelne Bestimmungen dieser Bedingungen unwirksam sein oder werden, bleiben die übrigen Bestimmungen davon unberührt.',
      'Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz von AstroPlays.',
    ],
  },
];

export default function WorldLeagueRulesPage() {
  return (
    <div className="overflow-x-hidden relative min-h-screen">
      <Background />

      <div className="relative pt-32 pb-32 px-6 md:px-8 max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-16">
          <a
            href="/world-league"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition text-sm mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Zurück
          </a>

          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
            World League
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-4 tracking-tight">
            Teilnahmebedingungen
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            Diese Bedingungen regeln die Teilnahme an der AstroPlays World League. Bitte lies sie
            vollständig durch, bevor du deinen Server anmeldest.
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-6">
            <span className="inline-flex items-center gap-2 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              Zuletzt aktualisiert: April 2026
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              Version 1.0
            </span>
          </div>
        </div>

        {/* ── QUICK NAV ── */}
        <div className="rounded-2xl bg-neutral-900/50 border border-white/[0.07] p-6 mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Inhalt</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.number}
                href={`#section-${s.number}`}
                className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-200 transition-colors group py-1"
              >
                <span className="text-[10px] font-bold text-gray-700 group-hover:text-indigo-500 transition-colors tabular-nums w-5">
                  {s.number}
                </span>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.number} id={`section-${section.number}`} className="scroll-mt-28">
              <div className="flex items-start gap-5 mb-5">
                <span className="text-xs font-bold text-indigo-500/50 tabular-nums pt-1 w-6 flex-shrink-0">
                  {section.number}
                </span>
                <h2 className="text-white font-bold text-xl tracking-tight">{section.title}</h2>
              </div>

              <div className="ml-11 space-y-3">
                {section.content.map((paragraph, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-indigo-500/30 text-xs pt-1 flex-shrink-0 select-none">—</span>
                    <p className="text-gray-500 text-sm leading-relaxed">{paragraph}</p>
                  </div>
                ))}
              </div>

              <div className="ml-11 mt-6 h-px bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* ── FOOTER NOTE ── */}
        <div className="mt-16 rounded-xl bg-yellow-500/5 border border-yellow-500/15 p-5 flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold text-sm mb-1">Hinweis</div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Die World League befindet sich derzeit in der Planungsphase. Diese Teilnahmebedingungen sind
              vorläufig und können sich basierend auf Feedback und technischen Anforderungen jederzeit ändern.
              Die jeweils gültige Version ist stets auf dieser Seite abrufbar.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <a
            href="/world-league/leaderboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
          >
            Rangliste ansehen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 active:scale-95 transition-all text-gray-300 hover:text-white font-medium text-sm"
          >
            Zurück zur Startseite
          </a>
        </div>

      </div>
    </div>
  );
}
