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

// 🔥 optional: user aus API holen (wenn du kein global state hast)
async function getUser() {
  const res = await fetch('/api/me')
  return res.json()
}

export default function Topbar({ view, filter, setFilter }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const [cancelReason, setCancelReason] = useState("")
  const [reasonType, setReasonType] = useState("")
  const [agreeBlock, setAgreeBlock] = useState(false)

  const [loggingOut, setLoggingOut] = useState(false)

  const router = useRouter()

  const filters = ["Offen", "Eingeladen", "Eingestellt", "Abgelehnt", "Alle"]

  const closeAll = () => {
    setOpen(false)
    setConfirmCancel(false)
    setCancelReason("")
    setReasonType("")
    setAgreeBlock(false)
  }

  const handleSubmitCancel = async () => {
    const user = await getUser()

    await fetch('/api/adminboard/resignation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discordId: user.user.id,
        email: user.user.email,
        reasonType,
        reasonText: cancelReason
      })
    })

    setConfirmCancel(false)
    setOpen(false)
    setCancelReason("")
    setReasonType("")
    setAgreeBlock(false)

    // 🔥 LOADING SCREEN START
    setLoggingOut(true)

    setTimeout(() => {
      router.push('/')
    }, 1200)
  }

  return (
    <div className="flex justify-between items-center h-16 border-b border-gray-800 px-6 relative">

      {/* 🔥 LOADING OVERLAY */}
      <AnimatePresence>
        {loggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[999] flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white mt-4 text-sm">Wird ausgeloggt...</p>
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="font-bold text-white text-lg">
        {view === 'applications' ? 'Bewerbungen' : 'AdminBoard'}
      </div>

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

      <AnimatePresence>
        {confirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[200]"
          >
            <div
              onClick={closeAll}
              className="absolute inset-0 bg-black/60"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-[560px] shadow-2xl z-10"
            >
              <div className="mb-4">
                <h2 className="text-white text-lg font-semibold">
                  Kündigung im AdminBoard einreichen
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Feedback ist freiwillig, hilft uns jedoch unser Team zu verbessern.
                </p>
              </div>

              <select
                value={reasonType}
                onChange={(e) => setReasonType(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white text-sm border border-gray-700 focus:border-purple-500 outline-none mb-3"
              >
                <option value="">Kündigungsgrund auswählen (optional)</option>
                <option value="kein_interesse">Kein Interesse mehr</option>
                <option value="zeitliche_gruende">Zeitliche Gründe</option>
                <option value="private_gruende">Private Gründe</option>
                <option value="unzufriedenheit">Unzufriedenheit im Team</option>
                <option value="anderes_projekt">Wechsel zu anderem Projekt</option>
                <option value="sonstiges">Sonstiges</option>
              </select>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Optionales Feedback..."
                className="w-full h-28 p-3 rounded-lg bg-gray-800 text-white text-sm outline-none border border-gray-700 focus:border-purple-500 resize-none"
              />

              <div className="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300">
                <p className="mb-2">
                  Nach Einreichung werden Admin relevante personenbezogene Daten nach
                  <span className="text-white font-semibold"> 48 Stunden</span> gelöscht.
                </p>

                <p>
                  Widerspruch innerhalb dieser Zeit ist möglich, um die Kündigung zurückzuziehen.
                </p>
              </div>

              <label className="flex items-start gap-2 mt-4 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={agreeBlock}
                  onChange={(e) => setAgreeBlock(e.target.checked)}
                  className="mt-1"
                />

                <span>
                  Mir ist bewusst, dass ich eine 30 Tage Bewerbungssperre erhalte.
                </span>
              </label>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={closeAll}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Abbrechen
                </button>

                <button
                  disabled={!agreeBlock}
                  onClick={handleSubmitCancel}
                  className={`px-4 py-2 rounded-lg text-white 
                  ${agreeBlock
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-gray-700 cursor-not-allowed"}`}
                >
                  Kündigung einreichen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
