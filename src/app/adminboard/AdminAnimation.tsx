'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface AdminAnimationProps {
  onFinish?: () => void
}

export default function AdminAnimation({ onFinish }: AdminAnimationProps) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.()
    }, 3000) // schnelleres Ende nach 3 Sekunden

    return () => clearTimeout(timer)
  }, [onFinish])

  const circles = [0, 1, 2, 3, 4]

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {circles.map((i) => (
          <motion.div
            key={i}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1], rotate: [0, 360] }}
            transition={{ 
              duration: 1, 
              delay: i * 0.1, 
              repeat: Infinity, 
              repeatType: "loop", 
              ease: "easeInOut" 
            }}
          />
        ))}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-white mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        ASTRO<span className="text-purple-500">PLAYS</span>
      </motion.h1>

      <button
        onClick={() => onFinish?.()}
        className="absolute bottom-8 right-8 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition text-sm"
      >
        Überspringen
      </button>

    </div>
  )
}
