// ════════════════════════════════════════════════════════════════════════════
// app/(legal)/Datenschutz/page.tsx
//
// VERSION:  1.1
// STAND:    24.04.2025
//
// ⚠ VERSIONSPFLEGE:
//   V1.0 → V1.1  bei Tippfehler / Umformulierungen ohne inhaltliche Änderung
//   V1.0 → V2.0  bei neuen Diensten, neuen Datenverarbeitungen, neuen Cookies
//   Das Datum im Footer muss immer dem Tag der letzten Änderung entsprechen.
// ════════════════════════════════════════════════════════════════════════════

export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto text-gray-200 space-y-8">

      <h1 className="text-4xl font-bold text-white">Datenschutzerklärung</h1>

      {/* 1 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">1. Verantwortlicher</h2>
        <p className="text-gray-300 leading-relaxed">
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und
          anderer nationaler Datenschutzgesetze ist:
        </p>
        <p className="text-gray-300 leading-relaxed">
          <strong className="text-white">[NAME]</strong><br />
          [Briefkastenadresse — wird ergänzt]<br />
          E-Mail:{" "}
          <a href="mailto:astroplays.help@gmail.com" className="text-purple-400 hover:underline">
            astroplays.help@gmail.com
          </a>
        </p>
      </section>

      {/* 2 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">2. Allgemeine Hinweise</h2>
        <p>
          Wir nehmen den Schutz deiner personenbezogenen Daten sehr ernst und
          verarbeiten diese ausschließlich auf Grundlage der geltenden
          datenschutzrechtlichen Vorschriften, insbesondere der DSGVO und des
          Bundesdatenschutzgesetzes (BDSG). Diese Erklärung informiert dich
          darüber, welche Daten wir erheben, zu welchem Zweck und auf welcher
          Rechtsgrundlage wir sie verarbeiten sowie welche Rechte dir zustehen.
        </p>
      </section>

      {/* 3 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">3. Hosting — Website (Vercel)</h2>
        <p>
          Die Website wird gehostet bei{" "}
          <strong className="text-white">Vercel Inc.</strong>, 440 N Barranca Ave #4133,
          Covina, CA 91723, USA. Bei jedem Aufruf der Website werden durch Vercel
          automatisch Server-Protokolldaten erhoben, darunter:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>IP-Adresse des anfragenden Geräts (gekürzt / anonymisiert)</li>
          <li>Datum und Uhrzeit des Abrufs</li>
          <li>Aufgerufene URL und HTTP-Statuscode</li>
          <li>Übertragene Datenmenge und Browserinformationen (User-Agent)</li>
        </ul>
        <p>
          Diese Daten sind für den sicheren und stabilen Betrieb der Website
          technisch erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse). Die Logs werden nach spätestens 30 Tagen
          automatisch gelöscht. Mit Vercel besteht ein
          Datenverarbeitungsvertrag (DPA) gemäß Art. 28 DSGVO. Für Übertragungen
          in die USA stützen wir uns auf die Standardvertragsklauseln der
          EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="text-purple-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutz Vercel →
          </a>
        </p>
      </section>

      {/* 4 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">4. Hosting — Datenbank (Neon) und Bot-Server (Hetzner)</h2>
        <p>
          Die Website-Datenbank wird betrieben bei{" "}
          <strong className="text-white">Neon Inc.</strong>, 110 William St,
          New York, NY 10038, USA. Neon betreibt seine Datenbank-Server in der
          EU (Frankfurt, AWS eu-central-1). Es findet keine Übertragung
          personenbezogener Daten in die USA statt, da die Daten ausschließlich
          auf EU-Servern verarbeitet werden. Mit Neon besteht ein
          Datenverarbeitungsvertrag (DPA) gemäß Art. 28 DSGVO. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO.{" "}
          <a
            href="https://neon.tech/privacy-policy"
            className="text-purple-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutz Neon →
          </a>
        </p>
        <p>
          Der Discord-Bot wird auf einem Server bei{" "}
          <strong className="text-white">Hetzner Online GmbH</strong>,
          Industriestr. 25, 91710 Gunzenhausen, Deutschland betrieben. Die
          Server befinden sich in deutschen Rechenzentren; es findet keine
          Übertragung in Drittländer statt. Mit Hetzner besteht ein
          Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </section>

      {/* 5 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">5. Login über Discord (OAuth2)</h2>
        <p>
          Zur Nutzung des Dashboards kannst du dich über Discord anmelden. Dabei
          werden folgende Daten von Discord an uns übermittelt und in unserer
          Datenbank gespeichert:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Discord-Benutzer-ID (pseudonymisierter Identifikator)</li>
          <li>Discord-Benutzername und Anzeigename</li>
          <li>Mitgliedschaft in verbundenen Discord-Servern, soweit für die Diensterbringung erforderlich</li>
          <li>Temporäres OAuth2-Zugriffstoken (wird nicht dauerhaft gespeichert)</li>
        </ul>
        <p>
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung) zur Bereitstellung der Kernfunktionalität des
          Dienstes. Die Daten werden gelöscht, sobald du die Löschung deines
          Kontos verlangst und keine gesetzlichen Aufbewahrungspflichten
          entgegenstehen.
        </p>
        <p>
          Anbieter: Discord Inc., 444 De Haro Street, Suite 200, San Francisco,
          CA 94107, USA.{" "}
          <a
            href="https://discord.com/privacy"
            className="text-purple-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung Discord →
          </a>
        </p>
      </section>

      {/* 6 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">6. Zahlungsabwicklung (Stripe)</h2>
        <p>
          Alle Zahlungen werden ausschließlich über{" "}
          <strong className="text-white">Stripe Payments Europe Ltd.</strong>,
          1 Grand Canal Street Lower, Dublin 2, Irland abgewickelt. Bei einem
          Kauf übermittelst du deine Zahlungsdaten direkt an Stripe; wir
          erhalten dabei zu keinem Zeitpunkt deine vollständigen Kreditkartendaten
          oder Bankdaten. Wir speichern lediglich:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Eine pseudonymisierte Stripe-Kunden-ID zur Zuordnung von Käufen</li>
          <li>Den Transaktionsbetrag, das Datum und die gebuchte Leistung</li>
          <li>Deine E-Mail-Adresse zur Ausstellung von Belegen</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
          sowie Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Pflicht zur
          Buchführung). Rechnungsdaten werden gemäß § 147 AO für 10 Jahre
          aufbewahrt.{" "}
          <a
            href="https://stripe.com/de/privacy"
            className="text-purple-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung Stripe →
          </a>
        </p>
      </section>

      {/* 7 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">7. Transaktions-E-Mails</h2>
        <p>
          Im Rahmen des Kaufvorgangs und der Abonnementverwaltung versenden wir
          E-Mails mit Kaufbestätigungen und — sofern zutreffend — mit Hinweisen
          zu Preisänderungen oder Abo-Verlängerungen. Dazu wird deine
          E-Mail-Adresse gespeichert und verarbeitet. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Werbliche E-Mails
          werden ohne gesonderte Einwilligung nicht versendet.
        </p>
      </section>

      {/* 8 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">8. Cookies und Session-Daten</h2>
        <p>
          Wir setzen ausschließlich technisch notwendige Cookies ein, die für
          den Betrieb der Website und die Aufrechterhaltung deiner Login-Session
          unbedingt erforderlich sind. Diese Cookies dienen keinen Werbezwecken
          und erfordern keine separate Einwilligung (§ 25 Abs. 2 Nr. 2 TTDSG).
          Wir verzichten vollständig auf Tracking, Analyse-Tools oder
          Werbe-Cookies.
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400">
                <th className="px-4 py-3 font-medium">Cookie</th>
                <th className="px-4 py-3 font-medium">Zweck</th>
                <th className="px-4 py-3 font-medium">Speicherdauer</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 divide-y divide-gray-800">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">session</td>
                <td className="px-4 py-3">Login-Session nach Discord OAuth2</td>
                <td className="px-4 py-3">Sitzungsende / max. 30 Tage</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">astroplays_session</td>
                <td className="px-4 py-3">Anonyme Kaufnachweis-Protokollierung</td>
                <td className="px-4 py-3">Sitzungsende</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">9. Einwilligungs- und Aktionsprotokollierung (IP-Logging)</h2>
        <p>
          Zur rechtssicheren Dokumentation bestimmter Vorgänge — insbesondere
          der Bestätigung von Rechtsdokumenten und des Abschlusses von Käufen —
          werden folgende Daten protokolliert und in unserer Datenbank gespeichert:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>
            <strong className="text-white">IP-Adresse</strong> zum Zeitpunkt der
            Aktion (vollständig, da für den Nachweis der Handlung erforderlich)
          </li>
          <li>Zeitstempel der Aktion (Datum und Uhrzeit in UTC)</li>
          <li>
            Typ der Aktion, z.B.:
            <ul className="list-disc list-inside ml-5 mt-1 space-y-1 text-gray-400">
              <li>Kauf abgeschlossen</li>
              <li>AGB, Impressum oder Datenschutzerklärung per Checkbox bestätigt</li>
              <li>Bewerbung eingereicht (inkl. Bestätigung der Rechtsdokumente)</li>
              <li>Widerrufsbelehrung zur Kenntnis genommen</li>
            </ul>
          </li>
          <li>
            Versionsnummern aller zu diesem Zeitpunkt gültigen Rechtsdokumente
            (AGB, Datenschutzerklärung, Impressum)
          </li>
          <li>Anonymisierter Session-Identifikator zur Verknüpfung zusammengehöriger Aktionen</li>
        </ul>
        <p>
          <strong className="text-white">Warum wird die IP-Adresse gespeichert?</strong>{" "}
          Die IP-Adresse ist im deutschen Recht ein anerkanntes Mittel zum Nachweis
          der Urheberschaft einer digitalen Handlung (z.B. Vertragsschluss,
          Einwilligung). Ohne diesen Nachweis könnten im Streitfall weder Kauf noch
          Einwilligung belegt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an der Rechtssicherung und Beweissicherung).
        </p>
        <p>
          IP-Adressen aus Protokolleinträgen werden nach{" "}
          <strong className="text-white">3 Jahren</strong> automatisch gelöscht,
          sofern keine laufenden Rechtsstreitigkeiten bestehen, für die sie als
          Beweismittel benötigt werden. Kaufbezogene Protokolldaten unterliegen
          darüber hinaus der handelsrechtlichen Aufbewahrungspflicht von 10 Jahren
          (§ 147 AO), werden jedoch nach 3 Jahren pseudonymisiert (IP durch Hash ersetzt).
        </p>
        <p>
          Du hast das Recht, der Verarbeitung deiner IP-Adresse zu widersprechen
          (Art. 21 DSGVO). Beachte jedoch, dass bei einem berechtigten Widerspruch
          eine Nutzung kostenpflichtiger Dienste oder die Einreichung einer
          Bewerbung technisch nicht möglich ist, da der Nachweis der Handlung
          sonst nicht erbracht werden kann.
        </p>
      </section>

      {/* 10 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">10. Weitergabe von Daten an Dritte</h2>
        <p>
          Eine Weitergabe personenbezogener Daten an Dritte erfolgt ausschließlich:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>an <strong className="text-white">Stripe</strong> zur Abwicklung von Zahlungen (siehe § 6)</li>
          <li>an <strong className="text-white">Vercel</strong>, <strong className="text-white">Neon</strong> und <strong className="text-white">Hetzner</strong> als technische Infrastrukturanbieter (siehe §§ 3–4)</li>
          <li>wenn wir gesetzlich zur Herausgabe verpflichtet sind (z.B. auf richterliche Anordnung)</li>
        </ul>
        <p>
          Eine Weitergabe zu Marketingzwecken, an Datenhändler oder sonstige
          Dritte findet nicht statt.
        </p>
      </section>

      {/* 11 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">11. Speicherdauer</h2>
        <p>
          Personenbezogene Daten werden nur so lange gespeichert, wie es für den
          jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten
          bestehen:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Account-Daten (Discord-ID, Name): bis zur Löschung des Kontos auf Verlangen</li>
          <li>Rechnungs- und Transaktionsdaten: 10 Jahre gemäß § 147 AO</li>
          <li>Server-Protokolldaten (Vercel): max. 30 Tage</li>
          <li>IP-Adressen aus Aktionsprotokollen: 3 Jahre, danach Pseudonymisierung (IP durch Hash ersetzt)</li>
          <li>Vollständige Aktionsprotokolle (ohne IP): 10 Jahre bei kaufbezogenen Vorgängen, sonst 3 Jahre</li>
        </ul>
      </section>

      {/* 12 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">12. Deine Rechte</h2>
        <p>
          Dir stehen gegenüber dem Verantwortlichen folgende Rechte bezüglich
          deiner personenbezogenen Daten zu:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>
            <strong className="text-white">Auskunft</strong> (Art. 15 DSGVO) —
            Welche Daten wir über dich gespeichert haben
          </li>
          <li>
            <strong className="text-white">Berichtigung</strong> (Art. 16 DSGVO) —
            Korrektur unrichtiger Daten
          </li>
          <li>
            <strong className="text-white">Löschung</strong> (Art. 17 DSGVO) —
            Löschung deiner Daten, soweit keine Aufbewahrungspflichten entgegenstehen
          </li>
          <li>
            <strong className="text-white">Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
          </li>
          <li>
            <strong className="text-white">Datenübertragbarkeit</strong> (Art. 20 DSGVO) —
            Herausgabe deiner Daten in einem maschinenlesbaren Format
          </li>
          <li>
            <strong className="text-white">Widerspruch</strong> (Art. 21 DSGVO) —
            gegen Verarbeitungen auf Basis des berechtigten Interesses
          </li>
        </ul>
        <p>
          Zur Ausübung deiner Rechte wende dich per E-Mail an:{" "}
          <a href="mailto:astroplays.help@gmail.com" className="text-purple-400 hover:underline">
            astroplays.help@gmail.com
          </a>. Wir bearbeiten Anfragen innerhalb von 30 Tagen.
        </p>
        <p>
          Du hast außerdem das Recht, dich bei der zuständigen
          Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde
          richtet sich nach deinem Wohnsitz. Eine Liste der Behörden findest du
          unter{" "}
          <a
            href="https://www.bfdi.bund.de"
            className="text-purple-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            bfdi.bund.de
          </a>.
        </p>
      </section>

      {/* 13 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">13. Änderungen dieser Erklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen,
          um sie an geänderte rechtliche Anforderungen oder neue
          Datenverarbeitungsvorgänge anzupassen. Das Datum der letzten Änderung
          ist im Footer dieser Seite angegeben. Bei wesentlichen Änderungen werden
          wir registrierte Nutzer per E-Mail informieren.
        </p>
      </section>

      {/* Versionsinfo */}
      <div className="pt-8 border-t border-gray-800 text-gray-500 text-sm space-y-1 font-mono">
        <p>Version: 1.1</p>
        <p>Stand: 24.04.2025</p>
        <p>Verantwortlicher: [NAME] · astroplays.help@gmail.com</p>
      </div>

    </div>
  )
}
