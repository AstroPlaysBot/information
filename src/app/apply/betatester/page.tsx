'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BetaTesterApplyPage() {
  const router = useRouter();

  const [user, setUser] = useState<{
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    created_at: string;
  } | null>(null);

  const [form, setForm] = useState({
    age: '',
    email: '',
    whyBeta: '',
    modulesInterest: '',
    priorExperience: '',
    phoneReachable: '',
  });

  const [showToast, setShowToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const isFormValid = Object.values(form).every((v) => v.trim() !== '');

  // 🔹 Discord-User über Cookie laden
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          // nicht eingeloggt → OAuth starten
          window.location.href = '/api/discord-auth?state=/apply/betatester';
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setShowToast({
          type: 'error',
          message: 'Discord-Daten konnten nicht geladen werden.',
        });
      }
    }

    loadUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !user) {
      setShowToast({
        type: 'error',
        message: 'Bitte alle Felder ausfüllen.',
      });
      return;
    }

    const answers = {
      'Warum Beta Tester': form.whyBeta,
      'Module Interesse': form.modulesInterest,
      'Vorherige Erfahrung': form.priorExperience,
      'Telefon erreichbar': form.phoneReachable,
    };

    try {
      const res = await fetch('/api/adminboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.username,
          discordId: user.id,
          discriminator: user.discriminator,
          avatar: user.avatar,
          accountCreated: user.created_at,
          age: form.age,
          email: form.email,
          role: 'Beta Tester',
          answers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowToast({ type: 'success', message: 'Bewerbung gesendet!' });
        setTimeout(() => router.push('/'), 600);
      } else {
        setShowToast({
          type: 'error',
          message: 'Fehler beim Absenden: ' + data.error,
        });
      }
    } catch (err) {
      console.error(err);
      setShowToast({
        type: 'error',
        message: 'Unerwarteter Fehler.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        Bewerbung: Beta Tester
      </h1>

      {user && (
        <div className="flex items-center gap-4 mb-8">
          <img
            src={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : '/default-avatar.png'
            }
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-bold text-xl">
              {user.username}#{user.discriminator}
            </p>
            <p className="text-gray-400 text-sm">
              Account erstellt:{' '}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex flex-col gap-6"
      >
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-3 rounded-xl bg-gray-800"/>
        <textarea name="whyBeta" value={form.whyBeta} onChange={handleChange} placeholder="Warum Beta Tester?" className="p-3 rounded-xl bg-gray-800"/>
        <textarea name="modulesInterest" value={form.modulesInterest} onChange={handleChange} placeholder="Module Interesse" className="p-3 rounded-xl bg-gray-800"/>
        <textarea name="priorExperience" value={form.priorExperience} onChange={handleChange} placeholder="Vorherige Erfahrung" className="p-3 rounded-xl bg-gray-800"/>
        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Telefon erreichbar" className="p-3 rounded-xl bg-gray-800"/>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`py-3 rounded-xl font-semibold ${
            isFormValid
              ? 'bg-purple-600 hover:bg-pink-600'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          Bewerbung abschicken
        </button>
      </form>

      {showToast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded ${
          showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {showToast.message}
        </div>
      )}
    </div>
  );
}
