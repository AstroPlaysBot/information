'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FrontendDevApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    frameworkExperience: '',
    uiExperience: '',
    projectPortfolio: '',
    teamwork: '',
    phoneReachable: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const answers = {
      'Frontend-Frameworks': form.frameworkExperience,
      'UI/UX Erfahrung': form.uiExperience,
      'Projekt/Portfolio': form.projectPortfolio,
      'Teamarbeit': form.teamwork,
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
          role: 'Frontend Developer',
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
          frameworkExperience: '',
          uiExperience: '',
          projectPortfolio: '',
          teamwork: '',
          phoneReachable: '',
        });
        setTimeout(() => router.push('/'), 500);
      } else alert('Fehler: ' + data.error);
    } catch (err) { alert('Unerwarteter Fehler'); console.error(err); }
  };

  useEffect(() => { if (showToast) { const t = setTimeout(() => setShowToast(false), 10000); return () => clearTimeout(t); } }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16 relative">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Bewerbung: Frontend Developer</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Adresse" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="frameworkExperience" value={form.frameworkExperience} onChange={handleChange} placeholder="Welche Frontend-Frameworks beherrschst du?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="uiExperience" value={form.uiExperience} onChange={handleChange} placeholder="Hast du Erfahrung mit UI/UX Design?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="projectPortfolio" value={form.projectPortfolio} onChange={handleChange} placeholder="Zeig uns ein Projekt oder Portfolio" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="teamwork" value={form.teamwork} onChange={handleChange} placeholder="Wie arbeitest du im Team?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Können wir dich telefonisch erreichen?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <button type="submit" className="py-3 bg-purple-600 hover:bg-pink-600 rounded-xl font-semibold shadow-lg transition">
          Bewerbung abschicken
        </button>
      </form>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-4 opacity-100 transition-opacity duration-1000">
          Bewerbung gesendet
          <button className="font-bold" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}
    </div>
  );
}
