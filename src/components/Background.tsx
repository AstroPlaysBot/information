'use client';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden min-h-screen">
      {/* Grund-Dunkelheit */}
      <div className="absolute inset-0 bg-neutral-950" />

      {/* Sternen-Glow OBEN */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
                   w-[1200px] h-[600px]
                   bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),transparent_70%)]"
      />

      {/* Dezente Sterne */}
      <div className="absolute inset-0 bg-stars opacity-40" />

      {/* Rand-Details unten */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96
                   bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent_70%)]"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96
                   bg-[radial-gradient(circle,rgba(168,85,247,0.15),transparent_70%)]"
      />
    </div>
  );
}
