'use client';
import { useState } from 'react';

export default function BackendDevApplyPage() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    languageExperience: '',
    databaseExperience: '',
    apiExperience: '',
    problemSolving: '',
    phoneReachable: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bewerbung Backend Developer:', form);
    alert('Bewerbung abgeschickt!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Bewerbung: Backend Developer</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="age" value={form.age} onChange={handleChange} placeholder="Alter" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email Adresse" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <textarea name="languageExperience" value={form.languageExperience} onChange={handleChange} placeholder="Welche Programmiersprachen beherrschst du?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="databaseExperience" value={form.databaseExperience} onChange={handleChange} placeholder="Hast du Erfahrung mit Datenbanken?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="apiExperience" value={form.apiExperience} onChange={handleChange} placeholder="Hast du Erfahrung mit APIs oder Backend-Architekturen?" className="p-3 rounded-xl bg-gray-800 text-white"/>
        <textarea name="problemSolving" value={form.problemSolving} onChange={handleChange} placeholder="Beschreibe deine Herangehensweise bei Problemstellungen" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <input name="phoneReachable" value={form.phoneReachable} onChange={handleChange} placeholder="Können wir dich telefonisch erreichen?" className="p-3 rounded-xl bg-gray-800 text-white"/>

        <button type="submit" className="py-3 bg-purple-600 hover:bg-pink-600 rounded-xl font-semibold shadow-lg transition">
          Bewerbung abschicken
        </button>
      </form>
    </div>
  );
}
