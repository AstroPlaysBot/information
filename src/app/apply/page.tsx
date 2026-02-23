'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  created_at: string;
}

export default function ApplyFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValue, setFormValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔹 Position aus URL (?application=moderator)
  const applicationId = searchParams.get('application');

  // 🔹 Guard: Immer gültige Position checken
  useEffect(() => {
    if (!applicationId) {
      router.replace('/apply'); // Keine Position -> zurück zur Auswahl
    }
  }, [applicationId, router]);

  // 🔹 Discord-Login laden
  useEffect(() => {
    async function fetchUser() {
      const token = searchParams.get('token');
      if (!token) {
        // Kein Token -> zurück zur Positionswahl
        router.replace('/apply');
        return;
      }

      try {
        const res = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Discord Join-Date (Snowflake) berechnen
        const created_at = new Date(
          Number((BigInt(data.id) >> 22n) + 1420070400000n)
        );

        setUser({ ...data, created_at: created_at.toISOString() });
        setLoading(false);
      } catch (err) {
        console.error('Discord fetch error', err);
        router.replace('/apply');
      }
    }

    fetchUser();
  }, [router, searchParams]);

  // 🔹 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue || !user || !applicationId) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/adminboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.username,
          discordId: user.id,
          discriminator: user.discriminator,
          avatar: user.avatar,
          role: applicationId,
          answers: { text: formValue },
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormValue('');
      } else {
        alert('Fehler beim Absenden');
      }
    } catch (err) {
      console.error(err);
      alert('Fehler beim Absenden');
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Ladezustand
  if (loading) return <div className="text-center text-white mt-20">Lade Discord-Daten…</div>;

  // 🔹 Benutzer konnte nicht geladen werden
  if (!user) {
    return (
      <div className="text-center text-white mt-20">
        Benutzer konnte nicht geladen werden
      </div>
    );
  }

  // 🔹 Erfolgreiches Absenden
  if (success) {
    return <div className="text-center text-white mt-20 text-2xl">✅ Bewerbung erfolgreich abgeschickt!</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      {/* Discord Info */}
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
          <p className="text-gray-300 text-sm mt-1">Bewerbung für: <span className="font-semibold">{applicationId}</span></p>
        </div>
      </div>

      {/* Bewerbungsformular */}
      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <textarea
          placeholder="Warum möchtest du dich bewerben?"
          className="p-3 rounded bg-gray-800 text-white"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          required
        />
        <button
          type="submit"
          className="py-3 px-6 rounded-xl bg-purple-600 hover:bg-pink-600 text-white font-semibold shadow-lg transition-all disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Senden…' : 'Bewerbung abschicken'}
        </button>
      </form>
    </div>
  );
}
