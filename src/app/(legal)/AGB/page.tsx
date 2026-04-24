// ════════════════════════════════════════════════════════════════════════════
// app/(legal)/AGB/page.tsx
//
// VERSION:  1.0
// STAND:    23.04.2025
//
// ⚠ VERSIONSPFLEGE:
//   Ändere Version + Stand wenn du inhaltliche Anpassungen vornimmst.
//   V1.0 → V1.1  bei Tippfehler-Korrekturen / Umformulierungen
//   V1.0 → V2.0  bei neuen Klauseln, Preisänderungen, neuen Diensten
//   Das Datum im Footer muss immer dem Tag der letzten Änderung entsprechen.
// ════════════════════════════════════════════════════════════════════════════

export default function AGBPage() {
  return (
    <div className="max-w-4xl mx-auto text-gray-200 space-y-8">

      <h1 className="text-4xl font-bold text-white">
        Allgemeine Geschäftsbedingungen
      </h1>

      {/* §1 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für
          alle Verträge zwischen <strong className="text-white">[NAME]</strong>{" "}
          (nachfolgend „Anbieter"), erreichbar unter{" "}
          <strong className="text-white">astroplays.help@gmail.com</strong>, und
          Nutzern (nachfolgend „Nutzer") der Plattform{" "}
          <strong className="text-white">AstroPlays</strong> über die Website{" "}
          <strong className="text-white">https://astroplaysbot.de</strong>.
        </p>
        <p>
          Abweichende Bedingungen des Nutzers finden keine Anwendung, es sei denn,
          der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
        </p>
      </section>

      {/* §2 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 2 Leistungsbeschreibung</h2>
        <p>
          AstroPlays stellt digitale Zusatzmodule und einen Premium-Zugangsdienst
          für die Kommunikationsplattform Discord bereit. Das Leistungsangebot
          umfasst insbesondere:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>
            Einmalig erwerbbare Spielmodule — nach Aktivierung dauerhafter Zugang
            für den jeweiligen Nutzer
          </li>
          <li>
            Monatliches Premium-Abonnement mit Zugang zu allen verfügbaren
            Spielmodulen sowie exklusiven Zusatzfunktionen
          </li>
          <li>
            Automatisierte Benachrichtigungen, Daten-Feeds und botgestützte
            Funktionen innerhalb von Discord-Servern
          </li>
          <li>
            Web-Dashboard zur Verwaltung von Einstellungen und erworbenen Zugängen
          </li>
        </ul>
        <p>
          Ein Anspruch auf einen bestimmten Feature-Umfang, auf die Verfügbarkeit
          bestimmter Spielmodule oder auf Inhalte Dritter (z.B. Spielentwickler,
          Discord Inc.) besteht nicht. Der Anbieter ist berechtigt, den
          Leistungsumfang nach vorheriger Ankündigung anzupassen, zu erweitern
          oder einzuschränken.
        </p>
      </section>

      {/* §3 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 3 Vertragsschluss</h2>
        <p>
          Die Darstellung von Produkten und Preisen auf der Website stellt kein
          bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots
          (invitatio ad offerendum). Durch Klicken auf den jeweiligen Kauf- oder
          Abonnement-Button gibt der Nutzer ein verbindliches Angebot zum
          Vertragsschluss ab.
        </p>
        <p>
          Der Vertrag kommt zustande mit dem Eingang der Kaufbestätigungs-E-Mail
          oder — sofern die Leistung sofort freigeschaltet wird — mit der
          tatsächlichen Freischaltung. Mit Vertragsschluss bestätigt der Nutzer,
          die vorliegenden AGB gelesen und akzeptiert zu haben.
        </p>
        <p>
          Mit dem Kauf bestätigt der Nutzer außerdem, mindestens 18 Jahre alt zu
          sein oder die ausdrückliche Zustimmung eines Erziehungsberechtigten zu
          besitzen.
        </p>
      </section>

      {/* §4 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 4 Preise und Zahlung</h2>
        <p>
          Alle angegebenen Preise sind Endpreise in Euro und verstehen sich
          inklusive der gesetzlich anfallenden Mehrwertsteuer. Die Abwicklung
          sämtlicher Zahlungen erfolgt über den externen Zahlungsdienstleister{" "}
          <strong className="text-white">Stripe Payments Europe Ltd.</strong>,
          1 Grand Canal Street Lower, Dublin 2, Irland. Der Anbieter selbst
          speichert keine Zahlungsdaten (Kreditkartennummern o.ä.).
        </p>
        <p>
          Die Zahlung wird unmittelbar bei Vertragsschluss fällig. Bei
          Abonnements erfolgt die Abbuchung des Folgemonats automatisch zum
          jeweiligen Verlängerungsdatum.
        </p>
        <p>
          Der Anbieter behält sich vor, Preise für <em>zukünftige</em> Buchungen
          jederzeit zu ändern. Für bereits abgeschlossene Einzelkäufe gilt der
          zum Kaufzeitpunkt gezahlte Preis dauerhaft. Bei Preiserhöhungen für
          laufende Abonnements wird der Nutzer mindestens 30 Tage vor
          Inkrafttreten per E-Mail informiert und erhält ein außerordentliches
          Kündigungsrecht zum Ende des laufenden Abrechnungszeitraums.
        </p>
      </section>

      {/* §5 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          § 5 Widerrufsrecht bei digitalen Inhalten
        </h2>
        <p>
          Bei digitalen Inhalten, die nicht auf einem körperlichen Datenträger
          geliefert werden und deren Bereitstellung unmittelbar nach dem Kauf
          beginnt, erlischt das gesetzliche Widerrufsrecht gemäß{" "}
          <strong className="text-white">§ 356 Abs. 5 BGB</strong>, sofern der
          Nutzer vor dem Kauf ausdrücklich zugestimmt hat, dass die Ausführung
          des Vertrages sofort beginnt, und er zur Kenntnis genommen hat, dass er
          hierdurch sein Widerrufsrecht verliert.
        </p>
        <p>
          Diese Zustimmung wird während des Kaufvorgangs durch aktives Ankreuzen
          einer Bestätigungs-Checkbox eingeholt. Zeitpunkt, Inhalt und die zum
          Zeitpunkt gültige Dokumentenversion dieser Bestätigung werden
          protokolliert und können auf Verlangen nachgewiesen werden.
        </p>
      </section>

      {/* §6 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          § 6 Abonnements und Kündigung
        </h2>
        <p>
          Das Premium-Abonnement wird auf unbestimmte Zeit geschlossen und
          verlängert sich automatisch jeweils um einen Monat, sofern es nicht
          rechtzeitig vor Ablauf des laufenden Abrechnungszeitraums gekündigt wird.
        </p>
        <p>
          Die Kündigung kann jederzeit mit Wirkung zum Ende des jeweiligen
          Abrechnungszeitraums über das Web-Dashboard oder per E-Mail an{" "}
          <strong className="text-white">astroplays.help@gmail.com</strong>{" "}
          erfolgen. Nach Kündigung bleiben alle Funktionen bis zum Ende des
          bereits bezahlten Zeitraums uneingeschränkt aktiv. Eine anteilige
          Rückerstattung für bereits bezahlte Zeiträume erfolgt nicht, außer in
          den in § 8 geregelten Fällen der Diensteinstellung.
        </p>
      </section>

      {/* §7 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          § 7 Nutzerkonto und Pflichten
        </h2>
        <p>
          Zur Nutzung bestimmter Funktionen ist eine Anmeldung über Discord
          (OAuth2) erforderlich. Der Nutzer ist für die Sicherheit seiner
          Zugangsdaten selbst verantwortlich. Erworbene Zugänge sind
          personengebunden und nicht übertragbar. Die kommerzielle
          Weiterveräußerung sowie die Überlassung an Dritte sind untersagt.
        </p>
        <p>
          Darüber hinaus verpflichtet sich der Nutzer:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>keine rechtswidrigen Inhalte zu verbreiten oder den Dienst für illegale Zwecke zu nutzen</li>
          <li>den Dienst nicht durch automatisierte Abfragen übermäßig zu belasten</li>
          <li>keine Angriffe auf Server, Infrastruktur oder andere Nutzer durchzuführen</li>
          <li>keine Fehler oder Sicherheitslücken gezielt auszunutzen</li>
        </ul>
        <p>
          Bei Verstößen gegen diese Pflichten ist der Anbieter berechtigt, den
          Zugang ohne Vorwarnung und ohne Anspruch auf Rückerstattung zu sperren.
        </p>
      </section>

      {/* §8 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          § 8 Verfügbarkeit und Diensteinstellung
        </h2>
        <p>
          Der Anbieter ist bestrebt, die Dienste kontinuierlich und störungsfrei
          bereitzustellen, übernimmt jedoch keine Garantie für eine
          ununterbrochene Verfügbarkeit. Kurzfristige Unterbrechungen aufgrund von
          Wartungsarbeiten, technischen Störungen oder Ausfällen bei
          Drittanbietern begründen keinen Rückerstattungsanspruch, sofern sie
          eine Dauer von 72 aufeinanderfolgenden Stunden nicht überschreiten.
        </p>
        <p>
          Abhängigkeiten von Drittplattformen — insbesondere Discord Inc. und
          Spieleherstellern — liegen außerhalb des Einflussbereichs des Anbieters.
          Änderungen, Preiserhöhungen, API-Einschränkungen oder Abschaltungen
          seitens dieser Dritten begründen keinen Anspruch gegenüber dem Anbieter.
        </p>
        <p>
          Im Falle einer dauerhaften Einstellung des Dienstes von mehr als 30
          aufeinanderfolgenden Tagen werden anteilige, bereits bezahlte und noch
          nicht verbrauchte Abogebühren erstattet. Einmalige Käufe sind von einer
          Rückerstattung bei Diensteinstellung ausgenommen, sofern der Dienst
          nicht innerhalb von 30 Tagen nach dem jeweiligen individuellen Kaufdatum
          eingestellt wird.
        </p>
      </section>

      {/* §9 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 9 Haftung</h2>
        <p>
          Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des
          Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf
          Vorsatz oder grober Fahrlässigkeit beruhen.
        </p>
        <p>
          Für leicht fahrlässig verursachte Schäden haftet der Anbieter nur bei
          Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht), und
          zwar begrenzt auf den vertragstypisch vorhersehbaren Schaden. Im Übrigen
          ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.
        </p>
        <p>
          Eine Haftung für mittelbare Schäden, Folgeschäden, entgangenen Gewinn
          oder Datenverluste ist — soweit gesetzlich zulässig — ausgeschlossen.
        </p>
      </section>

      {/* §10 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 10 Änderungen der AGB</h2>
        <p>
          Der Anbieter behält sich vor, diese AGB aus sachlich gerechtfertigten
          Gründen (z.B. Gesetzesänderungen, neue Dienste, Preisanpassungen) zu
          ändern. Wesentliche Änderungen werden dem Nutzer mindestens 30 Tage vor
          Inkrafttreten per E-Mail mitgeteilt.
        </p>
        <p>
          Widerspricht der Nutzer den neuen AGB nicht innerhalb von 14 Tagen nach
          Zugang der Mitteilung, gelten die geänderten AGB als angenommen. Auf das
          Widerspruchsrecht und die Rechtsfolgen des Schweigens wird in der
          Mitteilung ausdrücklich hingewiesen.
        </p>
      </section>

      {/* §11 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">§ 11 Schlussbestimmungen</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland. Für Verbraucher mit
          gewöhnlichem Aufenthalt in einem anderen EU-Mitgliedstaat gelten
          ergänzend die zwingenden Schutzvorschriften ihres Heimatrechts.
        </p>
        <p>
          Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam
          oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen
          Bestimmungen unberührt. Anstelle der unwirksamen Regelung gilt die
          gesetzliche Regelung.
        </p>
      </section>

      {/* Versionsinfo */}
      <div className="pt-8 border-t border-gray-800 text-gray-500 text-sm space-y-1 font-mono">
        <p>Version: 1.0</p>
        <p>Stand: 23.04.2025</p>
        <p>Anbieter: [NAME] · astroplays.help@gmail.com</p>
      </div>

    </div>
  )
}
