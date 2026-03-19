// src/app/adminboard/AdminAnimation.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation } from 'framer-motion'

export default function AdminAnimation() {
  const router = useRouter()
  const controls = useAnimation()

  useEffect(() => {
    // Start 3D Kamera/Parallax Animation
    controls.start({
      scale: [1.3, 1, 1],
      rotateX: [10, 0, 0],
      rotateY: [-10, 0, 0],
      transition: { duration: 10, ease: 'easeInOut' },
    })

    // Nach 10 Sekunden weiter zum Dashboard
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => clearTimeout(timer)
  }, [controls, router])

  // Generiere zufällige Partikel
  const particles = Array.from({ length: 50 })

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center perspective-[2000px]">
      
      {/* Cinematic Background Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-full h-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-black"
      />

      {/* Glow-Partikel mit Parallax */}
      <div className="absolute inset-0">
        {particles.map((_, i) => {
          const size = Math.random() * 4 + 1
          const x = Math.random() * 100
          const y = Math.random() * 100
          const delay = Math.random() * 5
          const duration = 6 + Math.random() * 8
          return (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 80 - 40, 0],
                y: [0, Math.random() * 80 - 40, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration,
                delay,
                ease: 'easeInOut'
              }}
              className="absolute bg-purple-400 rounded-full blur-xl"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${y}%`,
                left: `${x}%`,
              }}
            />
          )
        })}
      </div>

      {/* Willkommenstext mit Parallax */}
      <motion.div
        initial={{ opacity: 0, y: 50, z: 50 }}
        animate={{ opacity: 1, y: 0, z: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]">
          Willkommen im Team
          <br />
          <span className="text-purple-400">AstroPlays</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 2, delay: 2 }}
          className="mt-6 text-white/70 md:text-lg lg:text-xl max-w-2xl mx-auto"
        >
          Professionelle Teamverwaltung & Projekte – alles an einem Ort.
        </motion.p>
      </motion.div>

      {/* Sanfte Kamera-Parallax Bewegung */}
      <motion.div
        animate={controls}
        className="absolute inset-0"
      />
    </div>
  )
}
