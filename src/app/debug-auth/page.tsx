'use client';

import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);

    try {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      const res = await fetch(`/api/discord-auth?code=${code}`);
      const json = await res.json();

      setData(json);
    } catch (err: any) {
      setData({
        step: 'client_error',
        error: err.message,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    runDebug();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <h1 className="text-2xl font-bold mb-4">
        🔥 Auth Debug Panel
      </h1>

      {loading && (
        <p className="text-yellow-400">Running debug flow...</p>
      )}

      {!data && !loading && (
        <p className="text-gray-400">Waiting for data...</p>
      )}

      {data && (
        <div className="space-y-4">

          <div className="p-4 bg-gray-900 rounded">
            <h2 className="text-green-400">Step</h2>
            <p>{data.step}</p>
          </div>

          <div className="p-4 bg-gray-900 rounded">
            <h2 className="text-red-400">Error</h2>
            <p>{data.error || 'none'}</p>
          </div>

          <div className="p-4 bg-gray-900 rounded">
            <h2 className="text-blue-400">Message</h2>
            <p>{data.message || 'no message'}</p>
          </div>

          <div className="p-4 bg-gray-900 rounded">
            <h2 className="text-purple-400">Raw Data</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(data.raw || data, null, 2)}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}
