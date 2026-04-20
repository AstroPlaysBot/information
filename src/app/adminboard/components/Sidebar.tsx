'use client'
import { ClipboardList, Trash2, ScrollText, Lock, Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'

const CRYPTIX_ID = "1462891063202156807"

export default function Sidebar({ setView, view, applicationCount, session }: any) {
  const [myRole, setMyRole] = useState<string | null>(null)
  const [isBetaTester, setIsBetaTester] = useState(false)

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setMyRole(d.role)
        setIsBetaTester(d.isBetaTester ?? false)
      })
      .catch(() => {})
  }, [])

  const canManage = myRole === "OWNER"

  const btnBase = "flex items-center gap-3 p-3 rounded-xl transition text-sm font-medium w-full"
  const btnActive = "bg-gray-800 text-white"
  const btnInactive = "text-gray-400 hover:bg-gray-800/60 hover:text-white"
  const btnDisabled = "opacity-40 cursor-not-allowed text-gray-500"

  return (
    <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-gray-800/60 p-5 flex flex-col gap-1">
      <div className="mb-8 px-1">
        <h1 className="text-lg font-bold text-white">AdminBoard</h1>
        <p className="text-xs text-gray-600 mt-0.5">Verwaltung</p>
      </div>

      {/* Neuigkeiten */}
      <button
        onClick={() => setView('news')}
        className={`${btnBase} ${view === 'news' ? btnActive : btnInactive}`}
      >
        <Newspaper size={16} />
        Neuigkeiten
      </button>

      {/* Bewerbungen */}
      <button
        onClick={() => { if (isBetaTester) return; setView('applications') }}
        className={`${btnBase} ${isBetaTester ? btnDisabled : view === 'applications' ? btnActive : btnInactive}`}
      >
        <ClipboardList size={16} />
        Bewerbungen
        {!isBetaTester && applicationCount > 0 && (
          <span className="ml-auto text-xs bg-red-500 px-2 py-0.5 rounded-full font-semibold">
            {applicationCount}
          </span>
        )}
      </button>

      {/* Papierkorb */}
      <button
        onClick={() => { if (isBetaTester) return; setView('trash') }}
        className={`${btnBase} ${isBetaTester ? btnDisabled : view === 'trash' ? btnActive : btnInactive}`}
      >
        <Trash2 size={16}/>
        Papierkorb
      </button>

      {/* Regeln */}
      <button
        onClick={() => { if (isBetaTester) return; setView('rules') }}
        className={`${btnBase} ${isBetaTester ? btnDisabled : view === 'rules' ? btnActive : btnInactive}`}
      >
        <ScrollText size={16}/>
        Regeln
      </button>

      {/* Divider */}
      <div className="border-t border-gray-800/60 my-2" />

      {/* Verwalten */}
      <button
        onClick={() => { if (!canManage) return; setView('manage') }}
        className={`${btnBase} ${!canManage ? btnDisabled : view === 'manage' ? btnActive : btnInactive}`}
      >
        <Lock size={16} />
        Verwalten
        {!canManage && (
          <span className="ml-auto text-xs text-gray-600">🔒</span>
        )}
      </button>
    </div>
  )
}
