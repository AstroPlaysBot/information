'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopbarProps {
  view: string
  filter: string
  setFilter: (filter: string) => void
}

export default function Topbar({ view, filter, setFilter }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const router = useRouter()

  const filters = ["Offen", "Eingeladen", "Eingestellt", "Abgelehnt", "Alle"]

  const closeAll = () => {
    setOpen(false)
    setConfirmCancel(false)
    setCancelReason("")
  }

  // 🔥 FIX: prevent React #310 crash (safe navigation after state cleanup)
  const handleSubmitCancel = () => {
    setConfirmCancel(false)
    setOpen(false)
    setCancelReason("")

    // allow React to finish state updates before navigation
    setTimeout(() => {
      router.push('/')
    }, 50)
  }

  return (
    <div className="flex justify-between items-center h-16 border-b border-gray-800 px-6 relative">

      {/* OVERLAY */}
      <AnimatePresence>
        {(open || confirmCancel) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="fixed inset-0 bg-black/60 z-[90]"
          />
        )}
      </AnimatePresence>

      {/* LEFT */}
      <div className="font-bold text-white text-lg">
        {view === 'applications' ? 'Bewerbungen' : 'AdminBoard'}
      </div>

      {/* FILTERS */}
      {view === 'applications' && (
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition
                ${filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* SETTINGS */}
      <div className="relative z-[120]">
        <button
          onClick={() => setOpen(v => !v)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
        >
          <Settings size={18} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl w-44 shadow-xl z-[130]"
            >
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 w-full p-3 hover:bg-gray-800"
              >
                <LogOut size={16} /> Ausloggen
              </button>

              <button
                onClick={() => {
                  setOpen(false)
                  setConfirmCancel(true)
                }}
                className="flex items-center gap-2 w-full p-3 hover:bg-gray-800 text-red-400"
              >
                Kündigen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[200]"
          >
            {/* BACKDROP */}
            <div
              onClick={closeAll}
              className="absolute inset-0 bg-black/60"
            />

            {/* MODAL */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-[520px] shadow-2xl z-10"
            >

              {/* HEADER */}
              <div className="mb-4">
                <h2 className="text-white text-lg font-semibold">
                  Kündigung bei AstroPlays einreichen
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Kündigungsgrund optional (für Feedback empfohlen).
                </p>
              </div>

              {/* TEXTAREA */}
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="z.B. Kein Bedarf mehr / Budget / Wechsel zu ..."
                className="w-full h-32 p-3 rounded-lg bg-gray-800 text-white text-sm outline-none border border-gray-700 focus:border-purple-500 resize-none"
              />

              {/* FOOTER */}
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={closeAll}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Abbrechen
                </button>

                <button
                  onClick={handleSubmitCancel}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                >
                  Einreichen
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
