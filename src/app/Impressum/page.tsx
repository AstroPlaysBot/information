// src/app/Impressum/page.tsx
export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto text-gray-200 space-y-8">
      <h1 className="text-4xl font-bold text-white">Impressum</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Angaben gemäß § 5 TMG</h2>

        <p>
          <strong>Projekt:</strong><br />
          AstroPlays Discord Bot
        </p>

        <p>
          <strong>Betreiber:</strong><br />
          [Dein Name]
        </p>

        <p>
          <strong>Kontakt:</strong><br />
          E-Mail: astroplays.help@gmail.com
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Haftung für Inhalte</h2>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
          keine Gewähr übernehmen.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Haftung für Links</h2>
        <p>
          Unsere Website enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben.
        </p>
      </section>
    </div>
  );
}
