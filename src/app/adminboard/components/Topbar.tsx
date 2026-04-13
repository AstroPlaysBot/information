'use client'

import { useState, useEffect } from 'react'
import { Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopbarProps {
  view: string
  filter: string
  setFilter: (filter: string) => void
}

export default function Topbar({ view, filter, setFilter }: TopbarProps) {

  const [open, setOpen] = useState(false)

  const filters = ["Alle", "Offen", "Eingeladen", "Eingestellt", "Abgelehnt"]

  return (
    <div className="flex justify-between items-center h-16 border-b border-gray-800 px-6">

      {/* Links oder Branding */}
      <div className="font-bold text-white text-lg">
        {view === 'applications' ? 'Bewerbungen' : 'AdminBoard'}
      </div>

      {/* Filter nur bei Bewerbungen */}
      {view === 'applications' && (
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition
                ${filter === f 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Settings Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
          <Settings size={18}/>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{opacity:0,y:-10}}
              animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-10}}
              className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl w-44 shadow-xl">

              <button
                onClick={() => window.location.href='/'}
                className="flex items-center gap-2 w-full p-3 hover:bg-gray-800">
                <LogOut size={16}/> Ausloggen
              </button>

              <button
                onClick={() => window.location.href='/'}
                className="flex items-center gap-2 w-full p-3 hover:bg-gray-800 text-red-400">
                Kündigen
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
