export default function FeaturesPage() {
  return (
    <div className="px-6 py-20 max-w-6xl mx-auto text-white">
      <h1 className="text-5xl font-extrabold mb-6">
        Funktionen & Module
      </h1>
      <p className="text-gray-300 mb-16">
        Alle Systeme von AstroPlays greifen ineinander –
        modular, leistungsstark und vollständig konfigurierbar.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          ["AstroBoost", "Automatische Boost-Erkennung, Benachrichtigungen und Community-Wertschätzung"],
          ["AstroGreeting", "Begrüßungs- und Verabschiedungssystem mit personalisierten Embeds"],
          ["AstroModeration", "Slash-Commands, Rollenrechte, temporäre Maßnahmen"],
          ["AstroModlogs", "Lückenlose Protokollierung aller Moderationsaktionen"],
          ["AstroShield", "Automatischer Schutz vor Spam, Beleidigungen und Regelverstößen"],
          ["AstroLogs", "Umfassendes Server-Logging und Aktivitätsübersicht"],
          ["AstroCall", "Dynamische Sprachkanäle und Join-to-Create-System"],
          ["AstroSupport", "Strukturiertes Support-System mit Warteschlangen"],
          ["AstroRole", "Automatische, regel- und ereignisbasierte Rollenlogik"],
          ["AstroDown", "Lockdown-Modus für kritische Server-Situationen"],
          ["AstroToJoin", "Automatische Rollenvergabe beim Serverbeitritt"],
          ["AstroTickets", "Flexibles, professionelles Ticketsystem für Support & Verwaltung"],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 p-6 bg-white/5 backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>
            <p className="text-gray-300">{desc}</p>
          </div>
        ))}
      </div>

      <footer className="mt-24 text-center text-gray-400">
        <p className="font-semibold text-white">
          AstroPlays ist kein Bot. AstroPlays ist ein System.
        </p>
        <p className="mt-2">Play. Manage. Level Up.</p>
      </footer>
    </div>
  );
}
