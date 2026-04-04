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
    }, 6000)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">

      <motion.h1
        className="text-6xl md:text-8xl font-bold flex gap-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >

        <motion.span
          className="text-white"
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          ASTRO
        </motion.span>

        <motion.span
          className="text-purple-500"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          PLAYS
        </motion.span>

      </motion.h1>

      <motion.div
        className="absolute text-white text-2xl top-20 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Willkommen bei
      </motion.div>

      <button
        onClick={() => onFinish?.()}
        className="absolute bottom-8 right-8 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition text-sm"
      >
        Überspringen
      </button>

    </div>
  )
}
