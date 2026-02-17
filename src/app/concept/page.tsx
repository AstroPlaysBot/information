export default function ConceptPage() {
  return (
    <div className="px-6 py-16 max-w-5xl mx-auto text-white">
      {/* Hero */}
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
        Das AstroPlays-Konzept
      </h1>
      <p className="text-lg text-gray-300 mb-16">
        Moderation, Struktur und Gaming – vereint in einem einzigen System.
      </p>

      {/* ASTRO */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4">
          ASTRO <span className="text-purple-400">– Kontrolle. Struktur. Sicherheit.</span>
        </h2>

        <p className="text-gray-300 mb-4">
          <strong>ASTRO</strong> ist das Fundament von AstroPlays.
          Es steht für alles, was einen Discord-Server
          <strong className="text-white"> stabil, sicher und professionell </strong>
          macht.
        </p>

        <p className="text-gray-300 mb-6">
          ASTRO deckt den kompletten Verwaltungs- und Moderationsbereich ab –
          ohne Chaos, ohne zig einzelne Bots, ohne komplizierte Setups.
        </p>

        <ul className="space-y-3 text-gray-200">
          <li>• Volle <strong>Serverkontrolle</strong> über ein zentrales Dashboard</li>
          <li>• <strong>Modulare Systeme</strong>, exakt nach Bedarf</li>
          <li>• <strong>Automatisierung</strong> zur Entlastung des Teams</li>
          <li>• <strong>Logging & Nachvollziehbarkeit</strong>, auch bei Discord-Aktionen</li>
          <li>• <strong>Sicherheit & Schutz</strong> für Community und Inhalte</li>
        </ul>

        <p className="mt-6 text-lg font-semibold">
          ASTRO läuft immer im Hintergrund.<br />
          <span className="text-purple-400">ASTRO hält deinen Server am Leben.</span>
        </p>
      </section>

      {/* PLAYS */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4">
          PLAYS <span className="text-green-400">– Games. Community. Erlebnisse.</span>
        </h2>

        <p className="text-gray-300 mb-4">
          <strong>PLAYS</strong> ist das Herz von AstroPlays.
          Hier geht es nicht um Regeln –
          sondern um <strong className="text-white">Spaß, Aktivität und Gaming-Erlebnisse</strong>.
        </p>

        <p className="text-gray-300 mb-6">
          PLAYS verbindet Discord direkt mit den Games, die deine Community liebt.
          Dein Server wird mehr als nur ein Chat –
          er wird eine <strong>aktive Plattform</strong>.
        </p>

        <ul className="space-y-3 text-gray-200">
          <li>• Gaming-Features, die <strong>direkt in Discord leben</strong></li>
          <li>• Systeme für <strong>Fortschritt, Belohnung & Interaktion</strong></li>
          <li>• Unterstützung für <strong>verschiedene Games & Spielstile</strong></li>
          <li>• Erweiterbare Strukturen für Events, Shops & Whitelists</li>
        </ul>

        <p className="mt-6 text-lg font-semibold text-green-400">
          PLAYS sorgt dafür, dass Mitglieder bleiben –<br />
          nicht wegen Regeln, sondern weil es Bock macht.
        </p>
      </section>

      {/* Kombination */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold mb-4">
          Warum <span className="text-purple-400">ASTRO</span> + <span className="text-green-400">PLAYS</span>?
        </h2>

        <p className="text-gray-300 mb-6">
          Die meisten Bots können entweder moderieren
          <strong> oder </strong>
          Gaming-Features anbieten.
        </p>

        <p className="text-xl font-bold mb-4">
          AstroPlays kann beides. Gleichzeitig.
        </p>

        <p className="text-gray-200">
          Ordnung durch ASTRO.<br />
          Aktivität durch PLAYS.
        </p>

        <p className="mt-4 font-semibold">
          <strong>Ein System. Eine Vision. AstroPlays.</strong>
        </p>
      </section>

      {/* Module */}
      <section>
        <h2 className="text-4xl font-bold mb-10">Module – Funktionen & Vorteile</h2>

        <div className="grid md:grid-cols-2 gap-8 text-gray-200">
          {[
            ["AstroBoost", "Boost-Erkennung, Benachrichtigungen, Wertschätzung"],
            ["AstroGreeting", "Begrüßung & Verabschiedung mit personalisierten Embeds"],
            ["AstroModeration", "Slash-Commands, Rollenrechte, temporäre Strafen"],
            ["AstroModlogs", "Lückenlose Moderations-Protokolle"],
            ["AstroShield", "Automatischer Wort- & Inhaltsfilter"],
            ["AstroLogs", "Umfassendes Server-Logging & Historien"],
            ["AstroCall", "Dynamische Sprachkanäle & Join-to-Create"],
            ["AstroSupport", "Strukturiertes Sprach-Support-System"],
            ["AstroRole", "Automatische & regelbasierte Rollenlogik"],
            ["AstroDown", "Lockdown-Modus für Notfälle"],
            ["AstroToJoin", "Automatische Rollen beim Beitritt"],
            ["AstroTickets", "Flexibles, professionelles Ticketsystem"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 p-6 bg-white/5 backdrop-blur"
            >
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-400">
        <p className="font-semibold text-white">
          AstroPlays ist kein Bot. AstroPlays ist ein System.
        </p>
        <p className="mt-2">Play. Manage. Level Up.</p>
        <p className="mt-6 text-sm">© AstroPlays</p>
      </footer>
    </div>
  );
}
