'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles: any = {
  moderator: {
    title: 'Moderator',
    fields: [
      { id: 'discordExperience', label: 'Hast du Erfahrung mit Discord Moderation?' },
      { id: 'ticketExperience', label: 'Hast du Erfahrung mit Ticketsystemen?' },
      { id: 'conflictHandling', label: 'Wie gehst du mit Konflikten um?' },
      { id: 'availability', label: 'Wie viel Zeit kannst du investieren?' },
      { id: 'languages', label: 'Welche Sprachkenntnisse besitzt du?' },
      { id: 'phoneReachable', label: 'Telefon erreichbar' },
    ],
  },
  'backend-developer': {
    title: 'Backend Developer',
    fields: [
      { id: 'languageExperience', label: 'Welche Programmiersprachen beherrschst du?' },
      { id: 'databaseExperience', label: 'Hast du Erfahrung mit Datenbanken?' },
      { id: 'apiExperience', label: 'Hast du Erfahrung mit APIs oder Backend Architekturen?' },
      { id: 'problemSolving', label: 'Beschreibe deine Herangehensweise bei Problemen' },
      { id: 'phoneReachable', label: 'Telefon erreichbar' },
    ],
  },
  'frontend-developer': {
    title: 'Frontend Developer',
    fields: [
      { id: 'frameworkExperience', label: 'Frontend Framework Erfahrung' },
      { id: 'uiExperience', label: 'UI/UX Erfahrung' },
      { id: 'projectPortfolio', label: 'Projekt oder Portfolio' },
      { id: 'teamwork', label: 'Teamarbeit Erfahrung' },
      { id: 'phoneReachable', label: 'Telefon erreichbar' },
    ],
  },
  betatester: {
    title: 'Beta Tester',
    fields: [
      { id: 'whyBeta', label: 'Warum Beta Tester?' },
      { id: 'modulesInterest', label: 'Welche Module interessieren dich?' },
      { id: 'priorExperience', label: 'Vorherige Erfahrung' },
      { id: 'phoneReachable', label: 'Telefon erreichbar' },
    ],
  },
  intern: {
    title: 'Praktikant',
    fields: [
      { id: 'interestArea', label: 'Welchen Bereich möchtest du dir anschauen? (Moderator, Developer, Marketing etc.)' },
      { id: 'learningGoal', label: 'Was möchtest du bei uns lernen?' },
      { id: 'experience', label: 'Hast du bereits Erfahrung?' },
      { id: 'phoneReachable', label: 'Telefon erreichbar' },
    ],
  },
  'promotion-manager': {
    title: 'Promotion Manager',
    fields: [
      { id: 'platforms', label: 'Wo würdest du Werbung machen? (Instagram / TikTok / YouTube / Twitch)' },
      { id: 'audience', label: 'Wie groß ist deine Reichweite?' },
      { id: 'promotionIdeas', label: 'Welche Ideen hast du um den Bot zu promoten?' },
      { id: 'phoneReachable', label: 'Telefon erreichbar' },
    ],
  },
};

// ----------------- Main Component -----------------
export default function ApplyRole() {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;
  const config = roles[role];

  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({ age: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let didCancel = false;

    async function loadUser() {
      const retries = 6;
      for (let i = 0; i < retries; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
          const res = await fetch('/api/me', { credentials: 'include' });
          if (!didCancel && res.ok) {
            const data = await res.json();
            setUser(data.user);
            setLoading(false);
            return;
          }
        } catch {}
      }

      if (!didCancel) {
        sessionStorage.setItem(
          'apply_error_toast',
          JSON.stringify({ message: 'Discord Login fehlgeschlagen' })
        );
        router.replace('/apply');
        setLoading(false);
      }
    }

    loadUser();
    return () => { didCancel = true; };
  }, [router]);

  if (!config) return <div>Role not found</div>;

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <div className="loader mb-4"></div>
        <p className="text-lg">Discord Login wird überprüft...</p>
        <style jsx>{`
          .loader {
            border: 6px solid #444;
            border-top: 6px solid #a855f7;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const isFormValid = () =>
    form.age && form.email && config.fields.every((f: any) => form[f.id]);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid() || !user) return;

    const answers: any = {};
    config.fields.forEach((f: any) => { answers[f.label] = form[f.id]; });

    try {
      const res = await fetch('/api/sendApplicationMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.title,
          discordId: user.id,
          name: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
          accountCreated: user.created_at,
          age: form.age,
          email: form.email,
          answers,
        }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/apply/advertised'); // Erfolgreiche Bewerbung
      }
    } catch {
      alert("Bewerbung konnte nicht gesendet werden!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Bewerbung: {config.title}</h1>

      {user && (
        <div className="flex items-center gap-4 mb-8 max-w-3xl mx-auto">
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

      <form onSubmit={submit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input
          name="age"
          placeholder="Alter"
          value={form.age}
          onChange={handleChange}
          className="p-3 bg-gray-800 rounded-xl"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-3 bg-gray-800 rounded-xl"
        />

        {config.fields.map((f: any) => (
          <textarea
            key={f.id}
            name={f.id}
            placeholder={f.label}
            value={form[f.id] || ''}
            onChange={handleChange}
            className="p-3 bg-gray-800 rounded-xl"
          />
        ))}

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`py-3 rounded-xl font-semibold transition-shadow shadow-lg ${isFormValid() ? 'bg-purple-600 hover:bg-pink-600' : 'bg-gray-700 cursor-not-allowed'}`}
        >
          Bewerbung abschicken
        </button>
      </form>
    </div>
  );
}
