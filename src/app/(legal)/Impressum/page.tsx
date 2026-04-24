// ════════════════════════════════════════════════════════════════════════════
// app/(legal)/Impressum/page.tsx
//
// VERSION:  1.0
// STAND:    23.04.2025
//
// ⚠ VERSIONSPFLEGE:
//   Das Impressum muss stets aktuell sein — falsche oder fehlende Angaben
//   sind eine Ordnungswidrigkeit (§ 16 TMG) und können abgemahnt werden.
//   Sofort aktualisieren bei: Namensänderung, neuer Adresse, neuem Gewerbe.
// ════════════════════════════════════════════════════════════════════════════

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto text-gray-200 space-y-8">

      <h1 className="text-4xl font-bold text-white">Impressum</h1>

      {/* Pflichtangaben */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Angaben gemäß § 5 TMG
        </h2>
        <div className="text-gray-300 leading-relaxed space-y-1">
          <p>
            <strong className="text-white">Projekt:</strong> AstroPlays Discord Bot
          </p>
          <p>
            <strong className="text-white">Betreiber:</strong> [NAME]
          </p>
          <p>
            <strong className="text-white">Anschrift:</strong><br />
            [Briefkastenadresse — wird ergänzt sobald eingerichtet]
          </p>
        </div>
        <p className="text-yellow-600/80 text-xs bg-yellow-500/5 border border-yellow-500/15 rounded-lg px-3 py-2">
          ⚠ Platzhalter vor Veröffentlichung mit echtem Namen und Adresse ersetzen.
          Diese Markierung entfernen. Ohne vollständige Angaben darf die Seite
          nicht öffentlich zugänglich sein.
        </p>
      </section>

      {/* Kontakt */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Kontakt</h2>
        <div className="text-gray-300 space-y-1.5">
          <p>
            E-Mail:{" "}
            <a
              href="mailto:astroplays.help@gmail.com"
              className="text-purple-400 hover:underline"
            >
              astroplays.help@gmail.com
            </a>
          </p>
          <p>
            Discord:{" "}
            <a
              href="https://discord.gg/astroplays"
              className="text-purple-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord-Server beitreten
            </a>
          </p>
        </div>
        <p className="text-gray-500 text-sm">
          Anfragen werden in der Regel innerhalb von 48–72 Stunden beantwortet.
          Eine Kontaktaufnahme per E-Mail ist ausreichend; eine postalische
          Antwortpflicht besteht nur bei rechtlich relevantem Schriftverkehr.
        </p>
      </section>

      {/* Gewerblicher Status */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          Gewerblicher Status
        </h2>
        <p className="text-gray-400">
          Derzeit werden keine entgeltlichen Leistungen angeboten. Der Dienst
          wird ohne kommerziellen Charakter betrieben. Sobald kostenpflichtige
          Leistungen aktiviert werden, erfolgt die Gewerbeanmeldung gemäß § 14
          GewO und dieses Impressum wird um die Gewerbedaten (Registernummer,
          zuständiges Amt, USt-IdNr.) ergänzt.
        </p>
        <p className="text-yellow-600/80 text-xs bg-yellow-500/5 border border-yellow-500/15 rounded-lg px-3 py-2">
          ⚠ Diesen Abschnitt entfernen und durch Gewerbedaten ersetzen
          sobald Zahlungen live geschaltet werden. Gleichzeitig Gewerbe
          anmelden (§ 14 GewO) — spätestens am Tag der ersten Zahlung.
        </p>
      </section>

      {/* Haftung Inhalte */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          Haftung für Inhalte
        </h2>
        <p className="text-gray-400">
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Als
          Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG
          sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
          oder gespeicherte fremde Informationen zu überwachen oder nach
          Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich.
        </p>
      </section>

      {/* Haftung Links */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          Haftung für Links
        </h2>
        <p className="text-gray-400">
          Diese Website enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
          der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt
          der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
          permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne
          konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
        </p>
      </section>

      {/* Urheberrecht */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Urheberrecht</h2>
        <p className="text-gray-400">
          Die durch den Betreiber erstellten Inhalte und Werke auf dieser Website
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des
          Betreibers. Downloads und Kopien dieser Seite sind nur für den
          privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte
          auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
          Urheberrechte Dritter beachtet.
        </p>
      </section>

      {/* OS-Plattform */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          Online-Streitbeilegung (OS-Plattform)
        </h2>
        <p className="text-gray-400">
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="text-purple-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht bereit und nicht verpflichtet, an einem
          Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      {/* Versionsinfo */}
      <div className="pt-8 border-t border-gray-800 text-gray-500 text-sm space-y-1 font-mono">
        <p>Version: 1.0</p>
        <p>Stand: 23.04.2025</p>
      </div>

    </div>
  )
}
