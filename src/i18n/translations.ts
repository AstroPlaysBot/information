export const translations = {
  de: {
    nav: {
      home: 'Home',
      modules: 'Module',
      support: 'Support',
      dashboard: 'Dashboard',
    },
    home: {
      title: 'Play, Manage, Level Up.',
      description:
        'AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren und zu verwalten.',
      featuresLink: 'Zu Funktionen →',
    },
    concept: {
      hero: {
        title: 'AstroPlays',
        subtitle:
          'Moderation UND Gaming. Kontrolle UND Spaß. Ein System. Keine Kompromisse.',
      },
      astro: {
        title: 'ASTRO',
        highlight: '– Kontrolle. Struktur. Sicherheit.',
        text1:
          'ASTRO ist das Fundament von AstroPlays. Es ist der Teil, der deinen Discord-Server stabil, sicher und professionell hält – egal ob 50 oder 50.000 Mitglieder.',
        text2:
          'Alles, was Ordnung schafft, Moderatoren entlastet und Kontrolle gibt, gehört zu ASTRO. Vollautomatisch, nachvollziehbar und zentral steuerbar.',
        features: [
          'Zentrale Serverkontrolle über ein Dashboard',
          'Modulare Systeme statt überladener Monolithen',
          'Automatisierung statt manuelle Arbeit',
          'Logging & Transparenz ohne Lücken',
          'Schutz & Sicherheit für Community und Team',
        ],
        footer:
          'ASTRO läuft immer im Hintergrund. ASTRO hält deinen Server am Leben.',
      },
      plays: {
        title: 'PLAYS',
        highlight: '– Games. Community. Erlebnisse.',
        text1:
          'PLAYS ist das Herz von AstroPlays. Hier geht es nicht um Regeln – sondern um Aktivität, Motivation und Gaming.',
        text2:
          'PLAYS macht deinen Server lebendig. Es verbindet Discord direkt mit Spielen, Fortschrittssystemen und Community-Interaktion.',
        features: [
          'Gaming-Features, die direkt in Discord stattfinden',
          'Systeme für Belohnung, Fortschritt & Status',
          'Unterstützung für verschiedene Games & Playstyles',
          'Erweiterbar für Events, Shops, Whitelists & mehr',
        ],
        footer:
          'PLAYS sorgt dafür, dass Mitglieder bleiben. Nicht wegen Regeln – sondern weil es Spaß macht.',
      },
      closing: {
        title: 'ASTRO bringt Ordnung. PLAYS bringt Leben.',
        subtitle: 'AstroPlays vereint beides.',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      modules: 'Modules',
      support: 'Support',
      dashboard: 'Dashboard',
    },
    home: {
      title: 'Play, Manage, Level Up.',
      description:
        'AstroPlays helps you organize and manage your Discord server.',
      featuresLink: 'Go to features →',
    },
    concept: {
      hero: {
        title: 'AstroPlays',
        subtitle:
          'Moderation AND Gaming. Control AND Fun. One system. No compromises.',
      },
      astro: {
        title: 'ASTRO',
        highlight: '– Control. Structure. Security.',
        text1:
          'ASTRO is the foundation of AstroPlays. It is the part that keeps your Discord server stable, safe, and professional – whether 50 or 50,000 members.',
        text2:
          'Everything that creates order, relieves moderators, and provides control belongs to ASTRO. Fully automatic, traceable, and centrally manageable.',
        features: [
          'Central server control via a dashboard',
          'Modular systems instead of overloaded monoliths',
          'Automation instead of manual work',
          'Logging & transparency without gaps',
          'Protection & security for community and team',
        ],
        footer:
          'ASTRO always runs in the background. ASTRO keeps your server alive.',
      },
      plays: {
        title: 'PLAYS',
        highlight: '– Games. Community. Experiences.',
        text1:
          'PLAYS is the heart of AstroPlays. It is not about rules – but about activity, motivation, and gaming.',
        text2:
          'PLAYS makes your server alive. It connects Discord directly with games, progression systems, and community interaction.',
        features: [
          'Gaming features that happen directly in Discord',
          'Systems for rewards, progression & status',
          'Support for various games & playstyles',
          'Expandable for events, shops, whitelists & more',
        ],
        footer:
          'PLAYS ensures members stay. Not because of rules – but because it’s fun.',
      },
      closing: {
        title: 'ASTRO brings order. PLAYS brings life.',
        subtitle: 'AstroPlays unites both.',
      },
    },
  },
} as const;

// ✅ Typen für alle Keys
export type TranslationKeys =
  | 'nav.home'
  | 'nav.modules'
  | 'nav.support'
  | 'nav.dashboard'
  | 'home.title'
  | 'home.description'
  | 'home.featuresLink'
  | 'concept.hero.title'
  | 'concept.hero.subtitle'
  | 'concept.astro.title'
  | 'concept.astro.highlight'
  | 'concept.astro.text1'
  | 'concept.astro.text2'
  | 'concept.astro.features'
  | 'concept.astro.footer'
  | 'concept.plays.title'
  | 'concept.plays.highlight'
  | 'concept.plays.text1'
  | 'concept.plays.text2'
  | 'concept.plays.features'
  | 'concept.plays.footer'
  | 'concept.closing.title'
  | 'concept.closing.subtitle';
