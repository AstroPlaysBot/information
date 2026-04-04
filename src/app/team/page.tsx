// src/app/team/page.tsx
'use client';

import React from 'react';
import Background from '../components/Background';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string; // optional, falls kein Bild vorhanden
}

const teamMembers: TeamMember[] = [
  {
    name: 'Max Mustermann',
    role: 'Projektleiter',
    bio: 'Leitet das AstroPlays Projekt und koordiniert das Team.',
    image: '/team/max.png', // Hier Bild hinzufügen
  },
  {
    name: 'Lisa Beispiel',
    role: 'Lead Developer',
    bio: 'Verantwortlich für die technischen Features und Backend-Architektur.',
    image: '/team/lisa.png',
  },
  {
    name: 'Jonas Muster',
    role: 'Community Manager',
    bio: 'Sorgt für ein aktives Community Management und Support.',
    // kein Bild = grauer Verlauf
  },
];

export default function TeamPage() {
  return (
    <div className="relative overflow-x-hidden">
      <Background />

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Unser Team
        </h1>
        <p className="text-gray-300 max-w-3xl text-lg md:text-xl">
          Lerne die Hauptpersonen hinter AstroPlays kennen – ihre Rollen, Aufgaben und Visionen.
        </p>
      </section>

      {/* TEAM GRID */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-neutral-900 rounded-2xl shadow-2xl hover:scale-105 hover:shadow-3xl transition-transform duration-300 p-6 flex flex-col items-center"
            >
              {/* Bild oder Platzhalter */}
              <div
                className={`w-48 h-48 rounded-xl overflow-hidden mb-6 relative 
                            bg-gradient-to-br from-gray-400 to-gray-200 flex items-center justify-center`}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 font-semibold">
                    Kein Bild
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                {member.name}
              </h3>
              {/* Rolle */}
              <p className="text-indigo-400 font-medium mb-3">{member.role}</p>
              {/* Bio */}
              <p className="text-gray-300 text-center text-sm md:text-base">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OPTIONAL: Footer Spacer */}
      <div className="h-32"></div>
    </div>
  );
}
