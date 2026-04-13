'use client';

import { useSearchParams } from 'next/navigation';

export default function DebugAuthPage() {
  const params = useSearchParams();

  const step = params.get('step');
  const msg = params.get('msg');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="p-6 border border-gray-700 rounded-xl w-full max-w-lg">
        
        <h1 className="text-xl font-bold mb-4">
          Auth Debug
        </h1>

        <div className="space-y-3 text-sm">

          <div>
            <p className="text-gray-400">Step:</p>
            <pre className="text-green-400 mt-1">
              {step || 'none'}
            </pre>
          </div>

          <div>
            <p className="text-gray-400">Message:</p>
            <pre className="text-red-400 mt-1 whitespace-pre-wrap break-words">
              {msg || 'no message'}
            </pre>
          </div>

        </div>

        <div className="mt-6 text-xs text-gray-500">
          Wenn hier ein Fehler steht, kommt er aus dem OAuth / DB / Admin Check Flow.
        </div>

      </div>
    </div>
  );
}
