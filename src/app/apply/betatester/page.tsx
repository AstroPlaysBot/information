'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BetaTesterApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    whyBeta: '',
    modulesInterest: '',
    priorExperience: '',
    phoneReachable: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          name: form.name,
          age: form.age,
          email: form.email,
          role: 'Beta Tester',
          answers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowToast(true);
        setForm({
          name: '',
          age: '',
          email: '',
          whyBeta: '',
          modulesInterest: '',
          priorExperience: '',
          phoneReachable: '',
        });

        setTimeout(() => {
          router.push('/');
        }, 500); // kleines Delay, damit Toast angezeigt wird
      } else {
        alert('Fehler beim Absenden: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Unerwarteter Fehler beim Absenden.');
    }
  };

  // Auto-Fade Toast nach 10 Sekunden
  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 10000);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16 relative">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Bewerbung: Beta Tester</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Adresse" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <textarea name="whyBeta" value={form.whyBeta} onChange={handleChange} placeholder="Warum möchtest du Beta Tester werden?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="modulesInterest" value={form.modulesInterest} onChange={handleChange} placeholder="Welche Module interessieren dich besonders?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="priorExperience" value={form.priorExperience} onChange={handleChange} placeholder="Hast du bereits Erfahrung als Beta Tester oder mit ähnlichen Projekten?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Können wir dich telefonisch erreichen?" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <button type="submit" className="py-3 bg-purple-600 hover:bg-pink-600 rounded-xl font-semibold shadow-lg transition">
          Bewerbung abschicken
        </button>
      </form>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-4 opacity-100 transition-opacity duration-1000">
          Bewerbung gesendet
          <button className="font-bold" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}
    </div>
  );
}
