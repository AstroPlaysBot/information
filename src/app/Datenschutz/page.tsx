// src/app/Datenschutz/page.tsx
'use client';
import React from 'react';
import LegalLayout from '../(legal)/layout';

export default function Datenschutz() {
  return (
    <div className="max-w-4xl mx-auto text-gray-200 space-y-8">
      <h1 className="text-4xl font-bold text-white">Datenschutzerklärung</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">1. Allgemeine Hinweise</h2>
        <p>
          Der Schutz deiner persönlichen Daten ist uns wichtig. Diese
          Datenschutzerklärung informiert darüber, welche Daten erfasst und wie sie
          verwendet werden.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">2. Login über Discord</h2>
        <p>Beim Login über Discord können folgende Daten verarbeitet werden:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Discord Benutzer-ID</li>
          <li>Benutzername</li>
          <li>Servermitgliedschaften</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">3. Speicherung von Daten</h2>
        <p>
          Einige Daten können in einer Datenbank gespeichert werden, um Funktionen
          des Discord-Bots oder Dashboards bereitzustellen.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">4. Weitergabe von Daten</h2>
        <p>
          Es erfolgt keine Weitergabe personenbezogener Daten an Dritte, außer wenn
          dies gesetzlich erforderlich ist.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">5. Rechte der Nutzer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Auskunft über gespeicherte Daten</li>
          <li>Löschung der Daten</li>
          <li>Berichtigung falscher Daten</li>
        </ul>
      </section>

      <p className="text-gray-400 text-sm pt-10">
        Stand: {new Date().getFullYear()}
      </p>
    </div>
  );
}
