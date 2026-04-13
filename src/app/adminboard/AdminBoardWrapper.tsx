'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AdminBoardClient from './AdminBoardClient'
import RulesPage from './rules/page'

export default function AdminBoardWrapper(){

  const [view, setView] = useState<'applications'|'rules'|'trash'>('applications')
  const [applicationCount, setApplicationCount] = useState(0)

  // Filter-State für Topbar
  const [filter, setFilter] = useState("Offen")

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">

      <Sidebar
        setView={setView}
        view={view}
        applicationCount={applicationCount}
      />

      <div className="flex flex-col flex-1">

        {/* Topbar bekommt jetzt Props */}
        <Topbar view={view} filter={filter} setFilter={setFilter} />

        <div className="flex-1 overflow-auto">

          {view === 'applications' &&
            <AdminBoardClient
              setApplicationCount={setApplicationCount}
              filter={filter}           // Filter an Client weitergeben
            />
          }

          {view === 'rules' &&
            <RulesPage/>
          }

          {view === 'trash' &&
            <div className="p-10 text-gray-400">
              Papierkorb kommt bald.
            </div>
          }

        </div>

      </div>

    </div>
  )
}
