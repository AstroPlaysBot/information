'use client';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
      {/* 🌌 Basis-Hintergrund */}
      <div className="absolute inset-0 bg-neutral-950" />

      {/* 🌫️ Sanfter Galaxy-Glow oben */}
      <div
        className="
          absolute top-[-20%] left-1/2 -translate-x-1/2
          w-[1400px] h-[700px]
          bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.28),transparent_70%)]
          blur-2xl
        "
      />

      {/* ⭐ Sterne (dezent, global) */}
      <div className="absolute inset-0 bg-stars opacity-35" />

      {/* ✨ Leichter Farbakzent links unten */}
      <div
        className="
          absolute bottom-[-10%] left-[-10%]
          w-[500px] h-[500px]
          bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_70%)]
          blur-xl
        "
      />

      {/* ✨ Leichter Farbakzent rechts unten */}
      <div
        className="
          absolute bottom-[-10%] right-[-10%]
          w-[500px] h-[500px]
          bg-[radial-gradient(circle,rgba(168,85,247,0.18),transparent_70%)]
          blur-xl
        "
      />
    </div>
  );
}
