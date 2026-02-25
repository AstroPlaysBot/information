'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cookies } from 'next/headers';

export default function BackendDevApplyPage() {
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
    languageExperience: '',
    databaseExperience: '',
    apiExperience: '',
    problemSolving: '',
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
      'Programmiersprachen': form.languageExperience,
      'Datenbank Erfahrung': form.databaseExperience,
      'API Erfahrung': form.apiExperience,
      'Problembehandlung': form.problemSolving,
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
          role: 'Backend Developer',
          answers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowToast({ type: 'success', message: 'Bewerbung gesendet!' });
        setForm({ age: '', email: '', languageExperience: '', databaseExperience: '', apiExperience: '', problemSolving: '', phoneReachable: '' });
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
      // 🔹 Token zuerst aus Cookie
      const cookieToken = cookies().get('discord_token')?.value;
      const token = cookieToken || searchParams.get('token');
      if (!token) {
        router.push('/apply/backend-developer');
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
      <h1 className="text-4xl font-extrabold mb-10 text-center">Bewerbung: Backend Developer</h1>

      {user && (
        <div className="flex items-center gap-4 mb-8">
          <img
            src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'}
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-bold text-xl">{user.username}#{user.discriminator}</p>
            <p className="text-gray-400 text-sm">Account erstellt: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Adresse" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="languageExperience" value={form.languageExperience} onChange={handleChange} placeholder="Welche Programmiersprachen beherrschst du?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="databaseExperience" value={form.databaseExperience} onChange={handleChange} placeholder="Hast du Erfahrung mit Datenbanken?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="apiExperience" value={form.apiExperience} onChange={handleChange} placeholder="Hast du Erfahrung mit APIs oder Backend-Architekturen?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="problemSolving" value={form.problemSolving} onChange={handleChange} placeholder="Beschreibe deine Herangehensweise bei Problemstellungen" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Können wir dich telefonisch erreichen?" className="p-3 rounded-xl bg-gray-800 text-white"/>

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
