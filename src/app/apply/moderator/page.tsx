'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModeratorApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    discordExperience: '',
    ticketExperience: '',
    conflictHandling: '',
    availability: '',
    phoneReachable: '',
  });
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isFormValid = Object.values(form).every((v) => v.trim() !== '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowToast({ type: 'error', message: 'Bitte alle Felder ausfüllen!' });
      return;
    }

    const answers = {
      'Discord Erfahrung': form.discordExperience,
      'Ticket Erfahrung': form.ticketExperience,
      'Konfliktmanagement': form.conflictHandling,
      'Verfügbarkeit': form.availability,
      'Telefon erreichbar': form.phoneReachable,
    };

    try {
      const res = await fetch('/api/adminboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: form.age,
          email: form.email,
          role: 'Moderator',
          answers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowToast({ type: 'success', message: 'Bewerbung gesendet!' });
        setForm({
          name: '',
          age: '',
          email: '',
          discordExperience: '',
          ticketExperience: '',
          conflictHandling: '',
          availability: '',
          phoneReachable: '',
        });
        setTimeout(() => router.push('/'), 500);
      } else {
        setShowToast({ type: 'error', message: 'Fehler beim Absenden: ' + data.error });
      }
    } catch (err) {
      console.error(err);
      setShowToast({ type: 'error', message: 'Unerwarteter Fehler beim Absenden.' });
    }
  };

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(null), 10000);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16 relative">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Bewerbung: Moderator</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Adresse" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="discordExperience" value={form.discordExperience} onChange={handleChange} placeholder="Hast du Erfahrung mit Discord Moderation?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="ticketExperience" value={form.ticketExperience} onChange={handleChange} placeholder="Hast du schon Tickets bearbeitet?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="conflictHandling" value={form.conflictHandling} onChange={handleChange} placeholder="Wie gehst du mit Konflikten um?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="availability" value={form.availability} onChange={handleChange} placeholder="Wann bist du verfügbar?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Können wir dich telefonisch erreichen?" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`py-3 rounded-xl font-semibold shadow-lg transition ${isFormValid ? 'bg-purple-600 hover:bg-pink-600' : 'bg-gray-700 cursor-not-allowed'}`}
        >
          Bewerbung abschicken
        </button>
      </form>

      {showToast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg flex items-center gap-4 transition-opacity duration-1000 ${
            showToast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {showToast.message}
          <button className="font-bold" onClick={() => setShowToast(null)}>×</button>
        </div>
      )}
    </div>
  );
}
