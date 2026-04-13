'use client'

import { ClipboardList, Trash2, ScrollText } from 'lucide-react'

export default function Sidebar({ setView, view, applicationCount }: any) {

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

        {/* 🔥 ONLY PENDING COUNT */}
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

    </div>
  )
}
