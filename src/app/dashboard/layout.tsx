<main className="flex-1 p-6 md:p-10 overflow-hidden relative">
  {/* Hintergrund optional */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-gray-900 via-black to-gray-800 opacity-60"></div>

  <div className="relative z-10 space-y-6">
    {children}
  </div>
</main>
