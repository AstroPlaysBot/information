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
        'AstroPlays hilft dir dabei, deinen Discord-Server zu organisieren, zu verwalten und auf das nächste Level zu bringen – alles an einem Ort.',
      conceptButton: 'Zum Konzept',
      featuresLink: 'Funktionen entdecken →',
      module1: {
        title: 'Modul 1',
        text: 'Text für Modul 1',
      },
      module2: {
        title: 'Modul 2',
        text: 'Text für Modul 2',
      },
      support: {
        title: 'Support',
        text: 'Hier kommt dein Support-Text rein.',
      },
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
      title: 'Play, Manage,\nLevel Up.',
      description:
        'AstroPlays helps you organize and manage your Discord server and take it to the next level – all in one place.',
      conceptButton: 'To Concept',
      featuresLink: 'Discover features →',
      module1: {
        title: 'Module 1',
        text: 'Text for Module 1',
      },
      module2: {
        title: 'Module 2',
        text: 'Text for Module 2',
      },
      support: {
        title: 'Support',
        text: 'Here goes your support text.',
      },
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
  | 'home.conceptButton'
  | 'home.featuresLink'
  | 'home.module1.title'
  | 'home.module1.text'
  | 'home.module2.title'
  | 'home.module2.text'
  | 'home.support.title'
  | 'home.support.text'
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
