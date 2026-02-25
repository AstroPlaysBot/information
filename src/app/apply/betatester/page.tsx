'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { cookies } from 'next/headers';

export default function BetaTesterApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    if (!user) {
      setShowToast({ type: 'error', message: 'Discord-Daten konnten nicht geladen werden.' });
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
        setForm({
          age: '',
          email: '',
          whyBeta: '',
          modulesInterest: '',
          priorExperience: '',
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
    async function fetchDiscordUser() {
      const token = searchParams.get('token');
      if (!token) {
        router.push('/apply/beta-tester');
        return;
      }

      try {
        const res = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Discord API Fehler: ' + res.status);
        const data = await res.json();
        const created_at = new Date(
          Number((BigInt(data.id) >> 22n) + 1420070400000n)
        ).toISOString();

        setUser({
          id: data.id,
          username: data.username,
          discriminator: data.discriminator,
          avatar: data.avatar,
          created_at,
        });
      } catch (err) {
        console.error('Discord User Fetch Error:', err);
        setShowToast({ type: 'error', message: 'Discord-Daten konnten nicht geladen werden!' });
      }
    }
    fetchDiscordUser();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16 relative">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Bewerbung: Beta Tester</h1>

      {user && (
        <div className="flex items-center gap-4 mb-8">
          <img
            src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'}
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-bold text-xl">{user.username}#{user.discriminator}</p>
            <p className="text-gray-400 text-sm">
              Account erstellt: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Adresse" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="whyBeta" value={form.whyBeta} onChange={handleChange} placeholder="Warum Beta Tester?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="modulesInterest" value={form.modulesInterest} onChange={handleChange} placeholder="Module Interesse" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="priorExperience" value={form.priorExperience} onChange={handleChange} placeholder="Vorherige Erfahrung" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Telefon erreichbar" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <button type="submit" disabled={!isFormValid} className={`py-3 rounded-xl font-semibold shadow-lg transition ${isFormValid ? 'bg-purple-600 hover:bg-pink-600' : 'bg-gray-700 cursor-not-allowed'}`}>
          Bewerbung abschicken
        </button>
      </form>

      {showToast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg flex items-center gap-4 transition-opacity duration-1000 ${showToast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {showToast.message}
          <button className="font-bold" onClick={() => setShowToast(null)}>×</button>
        </div>
      )}
    </div>
  );
}
