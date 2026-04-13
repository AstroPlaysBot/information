'use client';

import { useSearchParams } from 'next/navigation';

export default function DebugAuthPage() {
  const params = useSearchParams();

  const step = params.get('step');
  const msg = params.get('msg');
  const raw = params.get('raw');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="p-6 border border-gray-700 rounded-xl w-full max-w-2xl">

        <h1 className="text-2xl font-bold mb-6">
          🔥 Auth Debug Panel
        </h1>

        {/* STEP */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">Step</p>
          <pre className="text-green-400 mt-1">
            {step || 'none'}
          </pre>
        </div>

        {/* MESSAGE */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">Message</p>
          <pre className="text-red-400 mt-1 whitespace-pre-wrap break-words">
            {msg || 'no message'}
          </pre>
        </div>

        {/* RAW ERROR */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">Raw Debug (optional)</p>
          <pre className="text-yellow-300 mt-1 whitespace-pre-wrap break-words text-xs">
            {raw || 'no raw data'}
          </pre>
        </div>

        {/* HINTS */}
        <div className="mt-6 text-xs text-gray-500 space-y-1">
          <p>• step=error → Crash im OAuth Flow</p>
          <p>• msg leer → Server Error ohne serialisierbaren Inhalt</p>
          <p>• raw hilft bei Prisma / Runtime Errors</p>
        </div>

      </div>
    </div>
  );
}
