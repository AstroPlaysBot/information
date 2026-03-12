// src/app/apply/advertised/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdvertisedPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Prüfen, ob ein Fehler von /apply/[role] gesetzt wurde
  useEffect(() => {
    const stored = sessionStorage.getItem('apply_error_toast');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.message) setToastMessage(data.message);
      sessionStorage.removeItem('apply_error_toast');
    }
  }, []);

  // Auto-dismiss nach 10 Sekunden
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 10000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 px-6 py-20 text-center relative">
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-900 px-6 py-4 rounded-lg shadow-md flex items-center justify-between max-w-md w-full">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-4 font-bold text-gray-600 hover:text-gray-800"
          >
            ×
          </button>
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl font-bold mb-6">Vielen Dank für deine Bewerbung!</h1>
      <p className="mb-2 text-lg">Wir haben deine Bewerbung erfolgreich erhalten.</p>
      <p className="mb-2 text-lg">Unser Team wird diese so schnell wie möglich prüfen.</p>
      <p className="mb-2 text-lg">Halte dein E-Mail Postfach im Auge.</p>
      <p className="mb-8 text-lg">Wir melden uns bei dir, sobald es Neuigkeiten gibt.</p>

      <button
        onClick={() => router.push('/')}
        className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Zurück zur Startseite
      </button>
    </div>
  );
}
