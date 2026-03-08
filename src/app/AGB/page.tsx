// src/app/AGB/page.tsx
import { agb } from "./texts";

export default function AGBPage() {
  return (
    <article className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Allgemeine Geschäftsbedingungen
      </h1>

      <p className="text-gray-400">
        Diese Bedingungen regeln die Nutzung des Discord-Bots
        <strong className="text-white"> AstroPlaysBot</strong>.
      </p>

      <div
        className="space-y-6 leading-relaxed text-gray-300"
        dangerouslySetInnerHTML={{ __html: agb.de }}
      />

    </article>
  );
}
