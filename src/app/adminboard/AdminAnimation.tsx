'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function HomeAnimation() {
  const router = useRouter()

  useEffect(() => {
    // Nach 10 Sekunden zum Dashboard weiterleiten
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      
      {/* Hintergrundanimation (z.B. Kamerafahrt-Simulation) */}
      <motion.div
        initial={{ scale: 1.2, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 10 }}
        className="absolute w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
      />

      {/* Willkommenstext */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        className="relative z-10 text-5xl md:text-6xl text-white font-extrabold text-center drop-shadow-xl"
      >
        Willkommen im Team <span className="text-purple-500">AstroPlays</span>
      </motion.h1>

      {/* optional kleine Sterne/Partikel */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/3"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute w-1.5 h-1.5 bg-white rounded-full top-2/3 left-2/5"
        />
      </div>
    </div>
  )
}
