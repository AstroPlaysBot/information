// src/app/adminboard/AdminAnimation.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation } from 'framer-motion'

export default function AdminAnimation() {
  const router = useRouter()
  const controls = useAnimation()

  useEffect(() => {
    // Animation starten
    controls.start({
      scale: [1.2, 1, 1],
      rotate: [-5, 0, 0],
      transition: { duration: 10, ease: 'easeInOut' },
    })

    // Nach 10 Sekunden Dashboard anzeigen
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => clearTimeout(timer)
  }, [router, controls])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">

      {/* Cinematic Background Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-full h-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-black"
      />

      {/* Moving "Camera" Lights / Particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 80 - 40, 0],
              opacity: [0.5, 1, 0.5],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 6,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
            className="absolute bg-white rounded-full w-[2px] h-[2px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Welcome Text */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-extrabold text-white text-center drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
      >
        Willkommen im Team
        <br />
        <span className="text-purple-500">AstroPlays</span>
      </motion.h1>

      {/* Subtitle / Unternehmens-Slogan */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 2, delay: 2 }}
        className="relative z-10 mt-6 text-white/70 text-lg md:text-xl text-center max-w-2xl"
      >
        Dein Dashboard für professionelle Teamverwaltung und Projekte.
      </motion.p>

      {/* Optional subtle overlay grid for tech vibe */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none">
        {Array.from({ length: 400 }).map((_, idx) => (
          <div
            key={idx}
            className="w-[1px] h-[1px] bg-white/5"
          />
        ))}
      </div>

    </div>
  )
}
