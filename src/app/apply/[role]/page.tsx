'use client';
import { useState } from 'react';

export default function ApplyRole({ params }: { params: { role: string } }) {
  const [form, setForm] = useState<any>({ role: params.role });

  const submit = async () => {
    await fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    alert('Bewerbung gesendet!');
  };

  return (
    <div className="max-w-4xl mx-auto p-12 text-white">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        Bewerbung – {params.role.replace('-', ' ')}
      </h1>

      <div className="space-y-6">
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Alter" />
        <input placeholder="E-Mail Adresse" />
        <textarea placeholder="Warum bist du der perfekte Kandidat?" />

        {params.role === 'beta-tester' && (
          <>
            <input placeholder="Discord Server Mitgliederanzahl" />
            <input placeholder="Discord Server Link" />
          </>
        )}

        <button
          onClick={submit}
          className="mt-6 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition"
        >
          Bewerbung absenden
        </button>
      </div>
    </div>
  );
}
