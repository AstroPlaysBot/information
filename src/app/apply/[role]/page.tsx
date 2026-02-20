'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyRole({ params }: { params: { role: string } }) {
  const [form, setForm] = useState<any>({ role: params.role });
  const router = useRouter();

  const submit = async () => {
    await fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    // Weiterleitung nach Absenden
    router.push('/thank-you');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-gray-850/70 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-700">
        <h1 className="text-5xl font-extrabold mb-10 text-center text-white capitalize tracking-wide">
          Bewerbung – {params.role.replace('-', ' ')}
        </h1>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={form.name || ''}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-6 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          <input
            type="number"
            placeholder="Alter"
            value={form.age || ''}
            onChange={e => setForm({ ...form, age: e.target.value })}
            className="w-full px-6 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          <input
            type="email"
            placeholder="E-Mail Adresse"
            value={form.email || ''}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-6 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          <textarea
            placeholder="Warum bist du der perfekte Kandidat?"
            value={form.reason || ''}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            className="w-full px-6 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none h-32"
          />

          {params.role === 'beta-tester' && (
            <>
              <input
                type="text"
                placeholder="Discord Server Mitgliederanzahl"
                value={form.members || ''}
                onChange={e => setForm({ ...form, members: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              <input
                type="text"
                placeholder="Discord Server Link"
                value={form.server || ''}
                onChange={e => setForm({ ...form, server: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </>
          )}

          <button
            onClick={submit}
            className="w-full mt-6 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-lg text-white transition shadow-lg"
          >
            Bewerbung absenden
          </button>
        </div>
      </div>
    </div>
  );
}
