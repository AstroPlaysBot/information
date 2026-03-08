// src/app/AGB/page.tsx
'use client';
import React from 'react';
import { agb } from './texts';

export default function AGBPage() {
  return (
    <LegalLayout>
      <div className="max-w-4xl mx-auto text-gray-200 space-y-8">
        <h1 className="text-4xl font-bold text-white">Allgemeine Geschäftsbedingungen</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website
            sowie der angebotenen Dienste, insbesondere des Discord-Bots und des
            dazugehörigen Dashboards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Leistungsbeschreibung</h2>
          <p>
            Der Betreiber stellt einen Discord-Bot sowie ein Web-Dashboard zur
            Verwaltung verschiedener Funktionen bereit. Der Funktionsumfang kann
            jederzeit angepasst oder erweitert werden.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. Nutzerkonto</h2>
          <p>
            Zur Nutzung bestimmter Funktionen ist eine Anmeldung über Discord
            erforderlich. Der Nutzer ist dafür verantwortlich, seine Zugangsdaten
            sicher zu verwahren.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Pflichten der Nutzer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Keine rechtswidrigen Inhalte verbreiten</li>
            <li>Den Dienst nicht missbrauchen</li>
            <li>Keine Angriffe auf Server oder Infrastruktur durchführen</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Haftung</h2>
          <p>
            Der Betreiber übernimmt keine Haftung für Schäden, die durch die Nutzung
            oder Nichtverfügbarkeit des Dienstes entstehen.
          </p>
        </section>

        <p className="text-gray-400 text-sm pt-10">
          Stand: {new Date().getFullYear()}
        </p>
      </div>
    </LegalLayout>
  );
}
