'use client';

import React, { useEffect } from 'react';
import Background from '../components/Background';

export default function HomePage() {

  useEffect(() => {
    const section = sessionStorage.getItem('scrollToSection');
    if (section) {
      sessionStorage.removeItem('scrollToSection');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (!element) return;
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 8;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 200);
    }
  }, []);

  return (
    <div className="overflow-x-hidden relative">
      <Background />

      {/* HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 max-w-7xl mx-auto gap-12">
        <div className="flex flex-col items-start justify-center flex-1">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Play, Manage,<br />
            <span className="text-violet-500">Level Up.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren,
            zu verwalten und auf das nächste Level zu bringen – alles an einem Ort.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="/concept"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold px-7 py-3 shadow-lg shadow-indigo-500/20"
            >
              Zum Konzept
            </a>
            <a
              href="/features"
              className="text-gray-400 font-medium hover:text-white transition-colors"
            >
              Funktionen entdecken →
            </a>
          </div>
        </div>
      </section>

      {/* SUPPORT SECTION */}
      <section id="support" className="relative px-8 max-w-3xl mx-auto mt-48 mb-48 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-medium uppercase tracking-widest mb-6">
          Hilfe & Kontakt
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Support</h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Fragen, Probleme oder Feedback? Wir helfen dir gerne weiter –
          schreib uns direkt per Mail oder tritt unserem Discord bei.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:astroplays.help@gmail.com"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 hover:text-white font-medium text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            astroplays.help@gmail.com
          </a>
          <a
            href="https://discord.gg/jtxQA7jnKa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold text-sm shadow-lg shadow-indigo-500/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Discord beitreten
          </a>
        </div>
      </section>

      {/* APPLY SECTION */}
      <section id="apply" className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-medium uppercase tracking-widest mb-6">
          Werde Teil des Teams
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Bewerben</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Du möchtest aktiv an AstroPlays mitwirken und die Zukunft des Projekts mitgestalten?
          Dann bewirb dich jetzt als Teil unseres Teams.
        </p>
        <a
          href="/apply"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold px-10 py-4 text-base shadow-lg shadow-indigo-500/20"
        >
          Jetzt bewerben →
        </a>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="relative px-8 max-w-7xl mx-auto mt-48 mb-48 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-medium uppercase tracking-widest mb-6">
          Die Menschen dahinter
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Unser Team</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Lerne die Köpfe hinter AstroPlays kennen – ihr Engagement und ihre Vision machen das Projekt möglich.
        </p>
        <a
          href="/team"
          className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-semibold px-10 py-4 text-base"
        >
          Zum Team →
        </a>
      </section>
    </div>
  );
}
