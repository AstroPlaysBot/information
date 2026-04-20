'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, LogOut, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopbarProps {
  view: string
  filter: string
  setFilter: (filter: string) => void
  manageTab?: string
}

async function getUser() {
  const res = await fetch('/api/me')
  return res.json()
}

const VIEW_LABELS: Record<string, string> = {
  applications: 'Bewerbungen',
  news: 'Neuigkeiten',
  trash: 'Papierkorb',
  rules: 'Regeln',
  manage: 'Verwalten',
  zentrale: 'Zentrale',
}

const MANAGE_TAB_LABELS: Record<string, string> = {
  berechtigungen: 'Berechtigungen',
  zentrale: 'Zentrale',
}

export default function Topbar({ view, filter, setFilter, manageTab }: TopbarProps) {
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
    setLoggingOut(true)
    setTimeout(() => { router.push('/') }, 1200)
  }

  // Breadcrumb aufbauen
  const breadcrumbs: string[] = []
  if (view === 'manage') {
    breadcrumbs.push('Verwalten')
    if (manageTab) breadcrumbs.push(MANAGE_TAB_LABELS[manageTab] || manageTab)
  } else {
    breadcrumbs.push(VIEW_LABELS[view] || 'AdminBoard')
  }

  return (
    <>
      <div className="flex justify-between items-center h-14 border-b border-gray-800/60 px-6 relative bg-black/30 backdrop-blur-sm">

        <AnimatePresence>
          {loggingOut && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[999] flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-white mt-4 text-sm font-medium">Wird ausgeloggt...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600 font-medium">AdminBoard</span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-gray-700" />
              <span className={`text-xs font-medium ${
                i === breadcrumbs.length - 1
                  ? "text-white"
                  : "text-gray-500"
              }`}>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* Filter */}
        {view === 'applications' && (
          <div className="flex gap-1.5">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                  ${filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700/50"}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Settings */}
        <div className="relative z-[120]">
          <button
            onClick={() => setOpen(v => !v)}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 transition"
          >
            <Settings size={16} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {open && (
              <>
                <div className="fixed inset-0 z-[115]" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="absolute right-0 mt-2 bg-gray-900 border border-gray-700/60 rounded-xl w-44 shadow-2xl z-[130] overflow-hidden"
                >
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2.5 w-full px-4 py-3 hover:bg-gray-800 text-sm text-gray-300 hover:text-white transition"
                  >
                    <LogOut size={15} />
                    Ausloggen
                  </button>
                  <div className="border-t border-gray-800" />
                  <button
                    onClick={() => { setOpen(false); setConfirmCancel(true) }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 hover:bg-gray-800 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    Kündigen
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {confirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeAll} />
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              className="relative bg-gray-900 border border-gray-700/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl z-10"
            >
              <div className="mb-5">
                <h2 className="text-white text-lg font-bold">Kündigung einreichen</h2>
                <p className="text-gray-500 text-sm mt-1">Feedback ist freiwillig, hilft uns jedoch unser Team zu verbessern.</p>
              </div>

              <div className="space-y-3">
                <select
                  value={reasonType}
                  onChange={(e) => setReasonType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800 text-white text-sm border border-gray-700/60 focus:border-gray-500 outline-none transition"
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
                  className="w-full h-28 p-3 rounded-xl bg-gray-800 text-white text-sm outline-none border border-gray-700/60 focus:border-gray-500 resize-none transition"
                />
              </div>

              <div className="mt-4 p-4 rounded-xl bg-gray-800/60 border border-gray-700/40 text-sm text-gray-400 space-y-1.5">
                <p>Nach Einreichung werden Admin relevante personenbezogene Daten nach <span className="text-white font-semibold">48 Stunden</span> gelöscht.</p>
                <p>Widerspruch innerhalb dieser Zeit ist möglich, um die Kündigung zurückzuziehen.</p>
              </div>

              <label className="flex items-start gap-3 mt-4 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeBlock}
                  onChange={(e) => setAgreeBlock(e.target.checked)}
                  className="mt-0.5 accent-blue-500"
                />
                <span>Mir ist bewusst, dass ich eine <span className="text-white">30 Tage Bewerbungssperre</span> erhalte.</span>
              </label>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={closeAll}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-white text-sm transition"
                >
                  Abbrechen
                </button>
                <button
                  disabled={!agreeBlock}
                  onClick={handleSubmitCancel}
                  className={`px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition
                    ${agreeBlock ? "bg-red-600 hover:bg-red-500" : "bg-gray-700 cursor-not-allowed opacity-50"}`}
                >
                  Kündigung einreichen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
