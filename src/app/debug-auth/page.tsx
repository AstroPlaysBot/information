'use client';

import { useSearchParams } from 'next/navigation';

export default function DebugAuthPage() {
  const params = useSearchParams();
  const step = params.get('step');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 border border-gray-700 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Auth Debug</h1>

        <p>Step:</p>
        <pre className="text-green-400 mt-2">{step}</pre>

        <div className="mt-4 text-sm text-gray-400">
          Wenn hier etwas steht, weißt du wo der Flow bricht.
        </div>
      </div>
    </div>
  );
}
