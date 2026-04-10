// src/app/team/page.tsx
'use client'

import React from 'react'
import Background from '@/components/Background'

interface TeamMember {
  name: string
  role: string
  department: string
  bio: string
  image?: string
  founder?: boolean
}

const founder: TeamMember = {
  name: "Dein Name",
  role: "Gründer",
  department: "Projektleitung",
  bio: "Gründer von AstroPlays und verantwortlich für Vision, Entwicklung und Strategie des Projekts.",
  image: "/team/founder.png",
  founder: true
}

const teamMembers: TeamMember[] = [
  {
    name: "Max Beispiel",
    role: "Senior Moderator",
    department: "Moderation",
    bio: "Leitet das Moderationsteam und sorgt für Ordnung und Sicherheit im Discord.",
  },
  {
    name: "Lisa Dev",
    role: "Lead Frontend Developer",
    department: "Frontend Development",
    bio: "Verantwortlich für Webinterface, Dashboards und UI Entwicklung.",
  },
  {
    name: "Jonas Code",
    role: "Lead Backend Developer",
    department: "Backend Development",
    bio: "Entwickelt APIs, Datenbanken und die gesamte Bot-Logik.",
  },
  {
    name: "Mia Marketing",
    role: "Promotion Manager",
    department: "Promotion",
    bio: "Sorgt für Reichweite, Community Wachstum und Social Media.",
  }
]

export default function TeamPage() {

  return (
    <div className="relative overflow-x-hidden">
      <Background />

      {/* HERO */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Unser Team
        </h1>

        <p className="text-gray-300 max-w-3xl text-lg">
          Hinter AstroPlays steht ein engagiertes Team aus Entwicklern,
          Moderatoren und Community-Managern.
        </p>
      </section>

      {/* FOUNDER */}
      <section className="max-w-6xl mx-auto px-8 mb-32">

        <h2 className="text-center text-3xl font-bold text-white mb-12">
          Gründer
        </h2>

        <div className="flex justify-center">

          <div className="teamCard group">

            {/* Founder Badge */}
            <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
              Founder
            </div>

            {founder.image ? (
              <img src={founder.image} className="avatar"/>
            ) : (
              <div className="avatar placeholder"/>
            )}

            <h3>{founder.name}</h3>
            <p className="role">{founder.role}</p>
            <p className="dept">{founder.department}</p>

            <p className="bio">{founder.bio}</p>

          </div>

        </div>

      </section>

      {/* TEAM */}
      <section className="max-w-7xl mx-auto px-8 pb-32">

        <h2 className="text-center text-3xl font-bold text-white mb-16">
          Abteilungen
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {teamMembers.map(member => (

            <div key={member.name} className="teamCard group">

              {member.image ? (
                <img src={member.image} className="avatar"/>
              ) : (
                <div className="avatar placeholder"/>
              )}

              <h3>{member.name}</h3>

              <p className="role">{member.role}</p>

              <p className="dept">
                Leiter der Abteilung: {member.department}
              </p>

              <p className="bio">{member.bio}</p>

            </div>

          ))}

        </div>

      </section>

      {/* APPLY CTA */}
      <section className="text-center pb-40 px-8">

        <h2 className="text-4xl font-bold text-white mb-6">
          Werde Teil unseres Teams 🚀
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-10">
          Du möchtest aktiv an AstroPlays mitwirken, neue Features entwickeln
          oder unsere Community unterstützen? Dann bewirb dich jetzt und
          werde Teil unseres Teams!
        </p>

        <a
          href="/apply"
          className="
          inline-block
          px-10 py-4
          bg-gradient-to-r
          from-indigo-500
          to-purple-600
          text-white
          font-semibold
          rounded-xl
          shadow-xl
          hover:scale-105
          hover:shadow-indigo-500/40
          transition
          "
        >
          Jetzt bewerben
        </a>

      </section>

      {/* STYLES */}
      <style jsx>{`

        .teamCard{
          position:relative;
          padding:40px 30px;
          border-radius:20px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(20px);
          text-align:center;
          transition:all .4s;
          transform-style:preserve-3d;
        }

        .teamCard:hover{
          transform:translateY(-8px) rotateX(4deg) rotateY(4deg);
          box-shadow:0 20px 60px rgba(99,102,241,.35);
        }

        .avatar{
          width:150px;
          height:150px;
          border-radius:16px;
          object-fit:cover;
          margin:0 auto 20px auto;
          transition:transform .4s;
        }

        .teamCard:hover .avatar{
          transform:scale(1.05);
        }

        .placeholder{
          background:linear-gradient(135deg,#d1d5db,#9ca3af);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#374151;
          font-weight:bold;
        }

        h3{
          font-size:22px;
          color:white;
          margin-bottom:4px;
        }

        .role{
          color:#818cf8;
          font-weight:600;
          margin-bottom:6px;
        }

        .dept{
          font-size:13px;
          color:#9ca3af;
          margin-bottom:14px;
        }

        .bio{
          font-size:14px;
          color:#d1d5db;
        }

      `}</style>

    </div>
  )
}
