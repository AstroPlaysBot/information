'use client'

import { ClipboardList, Trash2, ScrollText, Lock } from 'lucide-react'

const CRYPTIX_ID = "1462891063202156807"

export default function Sidebar({ setView, view, applicationCount, session }: any) {

  const discordId = session?.user?.id
  const canManage = discordId === CRYPTIX_ID

  return (
    <div className="w-72 bg-black/60 backdrop-blur-xl border-r border-gray-800 p-6 flex flex-col">

      <h1 className="text-2xl font-bold mb-10">
        AdminBoard
      </h1>

      {/* Bewerbungen */}
      <button
        onClick={() => setView('applications')}
        className={`flex items-center gap-3 p-3 rounded-lg transition
        ${view === 'applications' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
      >
        <ClipboardList size={18} />

        Bewerbungen

        {applicationCount > 0 && (
          <span className="ml-auto text-xs bg-red-500 px-2 py-0.5 rounded-full">
            {applicationCount}
          </span>
        )}
      </button>

      {/* Papierkorb */}
      <button
        onClick={() => setView('trash')}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 mt-2"
      >
        <Trash2 size={18}/>
        Papierkorb
      </button>

      {/* Regeln */}
      <button
        onClick={() => setView('rules')}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 mt-2"
      >
        <ScrollText size={18}/>
        Regeln
      </button>

      {/* VERWALTEN (locked) */}
      <button
        onClick={() => {
          if (!canManage) return
          setView('manage')
        }}
        className={`flex items-center gap-3 p-3 rounded-lg mt-2 transition
          ${view === 'manage' ? 'bg-gray-800' : 'hover:bg-gray-800'}
          ${!canManage ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Lock size={18} />

        Verwalten

        {!canManage && (
          <span className="ml-auto text-xs text-gray-500">
            🔒
          </span>
        )}
      </button>

    </div>
  )
}
