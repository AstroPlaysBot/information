'use client'
import { ClipboardList, Trash2, ScrollText, Lock, Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'

const CRYPTIX_ID = "1462891063202156807"

export default function Sidebar({ setView, view, applicationCount, session }: any) {
  const [myRole, setMyRole] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then(r => r.json())
      .then(d => setMyRole(d.role))
      .catch(() => {})
  }, [])

  const canManage = myRole === "OWNER"
  const isBetaTester = myRole === "BETA_TESTER"

  return (
    <div className="w-72 bg-black/60 backdrop-blur-xl border-r border-gray-800 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">AdminBoard</h1>

      {/* Neuigkeiten */}
      <button
        onClick={() => { if (!isBetaTester) setView('news'); else setView('news') }}
        className={`flex items-center gap-3 p-3 rounded-lg transition
          ${view === 'news' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
      >
        <Newspaper size={18} />
        Neuigkeiten
      </button>

      {/* Bewerbungen */}
      <button
        onClick={() => { if (isBetaTester) return; setView('applications') }}
        className={`flex items-center gap-3 p-3 rounded-lg transition mt-2
          ${view === 'applications' ? 'bg-gray-800' : 'hover:bg-gray-800'}
          ${isBetaTester ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <ClipboardList size={18} />
        Bewerbungen
        {!isBetaTester && applicationCount > 0 && (
          <span className="ml-auto text-xs bg-red-500 px-2 py-0.5 rounded-full">
            {applicationCount}
          </span>
        )}
      </button>

      {/* Papierkorb */}
      <button
        onClick={() => { if (isBetaTester) return; setView('trash') }}
        className={`flex items-center gap-3 p-3 rounded-lg mt-2 transition
          ${view === 'trash' ? 'bg-gray-800' : 'hover:bg-gray-800'}
          ${isBetaTester ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <Trash2 size={18}/>
        Papierkorb
      </button>

      {/* Regeln */}
      <button
        onClick={() => { if (isBetaTester) return; setView('rules') }}
        className={`flex items-center gap-3 p-3 rounded-lg mt-2 transition
          ${view === 'rules' ? 'bg-gray-800' : 'hover:bg-gray-800'}
          ${isBetaTester ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <ScrollText size={18}/>
        Regeln
      </button>

      {/* Verwalten */}
      <button
        onClick={() => { if (!canManage) return; setView('manage') }}
        className={`flex items-center gap-3 p-3 rounded-lg mt-2 transition
          ${view === 'manage' ? 'bg-gray-800' : 'hover:bg-gray-800'}
          ${!canManage ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Lock size={18} />
        Verwalten
        {!canManage && (
          <span className="ml-auto text-xs text-gray-500">🔒</span>
        )}
      </button>
    </div>
  )
}
