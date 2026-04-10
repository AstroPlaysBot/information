// src/app/team/page.tsx
'use client';

import React from 'react';
import Background from '@/components/Background';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Max Mustermann',
    role: 'Projektleiter',
    bio: 'Leitet das AstroPlays Projekt und koordiniert das Team.',
    image: '/team/max.png',
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
  },
];

export default function TeamPage() {
  return (
    <div className="relative overflow-x-hidden">
      <Background />

      {/* HERO */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Unser Team
        </h1>

        <p className="text-gray-300 max-w-3xl text-lg md:text-xl">
          Lerne die Menschen hinter <span className="text-indigo-400 font-semibold">AstroPlays</span> kennen.
          Gemeinsam entwickeln wir Tools, Systeme und Ideen für eine bessere Discord-Community.
        </p>
      </section>

      {/* TEAM */}
      <section className="max-w-7xl mx-auto px-8 pb-32">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="
              group relative
              rounded-2xl
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              shadow-2xl
              p-8
              flex flex-col items-center
              text-center
              transition-all duration-500
              hover:-translate-y-3
              hover:shadow-indigo-500/20
              "
            >

              {/* Glow Effekt */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-xl transition" />

              {/* Avatar */}
              <div className="relative mb-6">

                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-40 group-hover:opacity-80 transition" />

                <div className="relative w-40 h-40 rounded-xl overflow-hidden">

                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="
                      w-full h-full object-cover
                      transition duration-500
                      group-hover:scale-110
                      "
                    />
                  ) : (
                    <div className="
                    w-full h-full
                    bg-gradient-to-br from-gray-400 to-gray-200
                    flex items-center justify-center
                    text-gray-700 font-semibold
                    ">
                      Kein Bild
                    </div>
                  )}

                </div>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-white mb-1">
                {member.name}
              </h3>

              {/* Rolle */}
              <p className="text-indigo-400 font-medium mb-4 tracking-wide">
                {member.role}
              </p>

              {/* Bio */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {member.bio}
              </p>

            </div>
          ))}

        </div>

      </section>
    </div>
  );
}
