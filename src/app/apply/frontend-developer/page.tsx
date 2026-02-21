'use client';
import { useState } from 'react';

export default function FrontendDevApplyPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bewerbung Frontend Developer:', form);
    alert('Bewerbung abgeschickt!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">
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
    </div>
  );
}
