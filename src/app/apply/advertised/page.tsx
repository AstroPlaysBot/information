// src/app/apply/advertised/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function AdvertisedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-purple-700 text-white px-6 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">Vielen Dank für deine Bewerbung!</h1>
      <p className="mb-2 text-lg">Wir haben deine Bewerbung erfolgreich erhalten.</p>
      <p className="mb-2 text-lg">Unser Team wird diese so schnell wie möglich prüfen.</p>
      <p className="mb-2 text-lg">Halte deine Discord Nachrichten im Auge.</p>
      <p className="mb-8 text-lg">Wir melden uns bei dir, sobald es Neuigkeiten gibt.</p>

      <button
        onClick={() => router.push('/')}
        className="bg-white text-purple-700 font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors"
      >
        Zurück zur Startseite
      </button>
    </div>
  );
}
