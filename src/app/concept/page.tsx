export default function ConceptPage() {
  return (
    <div className="px-6 py-20 max-w-5xl mx-auto text-white">
      {/* Hero */}
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
        AstroPlays
      </h1>
      <p className="text-xl text-gray-300 mb-20">
        Moderation <span className="text-purple-400">UND</span> Gaming.
        Kontrolle <span className="text-green-400">UND</span> Spaß.
        <br />
        Ein System. Keine Kompromisse.
      </p>

      {/* ASTRO */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold mb-6">
          ASTRO <span className="text-purple-400">– Kontrolle. Struktur. Sicherheit.</span>
        </h2>

        <p className="text-gray-300 mb-6">
          <strong>ASTRO</strong> ist das Fundament von AstroPlays.
          Es ist der Teil, der deinen Discord-Server
          <strong className="text-white"> stabil, sicher und professionell </strong>
          hält – egal ob 50 oder 50.000 Mitglieder.
        </p>

        <p className="text-gray-300 mb-8">
          Alles, was Ordnung schafft, Moderatoren entlastet und Kontrolle gibt,
          gehört zu ASTRO. Vollautomatisch, nachvollziehbar und zentral steuerbar.
        </p>

        <ul className="space-y-3 text-gray-200">
          <li>• Zentrale <strong>Serverkontrolle</strong> über ein Dashboard</li>
          <li>• <strong>Modulare Systeme</strong> statt überladener Monolithen</li>
          <li>• <strong>Automatisierung</strong> statt manuelle Arbeit</li>
          <li>• <strong>Logging & Transparenz</strong> ohne Lücken</li>
          <li>• <strong>Schutz & Sicherheit</strong> für Community und Team</li>
        </ul>

        <p className="mt-8 text-lg font-semibold text-purple-400">
          ASTRO läuft immer im Hintergrund.<br />
          ASTRO hält deinen Server am Leben.
        </p>
      </section>

      {/* PLAYS */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          PLAYS <span className="text-green-400">– Games. Community. Erlebnisse.</span>
        </h2>

        <p className="text-gray-300 mb-6">
          <strong>PLAYS</strong> ist das Herz von AstroPlays.
          Hier geht es nicht um Regeln –
          sondern um <strong className="text-white">Aktivität, Motivation und Gaming</strong>.
        </p>

        <p className="text-gray-300 mb-8">
          PLAYS macht deinen Server lebendig.
          Es verbindet Discord direkt mit Spielen, Fortschrittssystemen
          und Community-Interaktion.
        </p>

        <ul className="space-y-3 text-gray-200">
          <li>• Gaming-Features, die <strong>direkt in Discord stattfinden</strong></li>
          <li>• Systeme für <strong>Belohnung, Fortschritt & Status</strong></li>
          <li>• Unterstützung für <strong>verschiedene Games & Playstyles</strong></li>
          <li>• Erweiterbar für Events, Shops, Whitelists & mehr</li>
        </ul>

        <p className="mt-8 text-lg font-semibold text-green-400">
          PLAYS sorgt dafür, dass Mitglieder bleiben.<br />
          Nicht wegen Regeln – sondern weil es Bock macht.
        </p>
      </section>

      {/* Abschluss */}
      <section className="mt-24 text-center">
        <p className="text-2xl font-bold mb-4">
          ASTRO bringt Ordnung.<br />
          PLAYS bringt Leben.
        </p>
        <p className="text-xl text-gray-300">
          <strong>AstroPlays vereint beides.</strong>
        </p>
      </section>
    </div>
  );
}
