'use client'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AdminBoardClient from './AdminBoardClient'
import RulesPage from './rules/page'
import NewsPage from './news/page'
import ManagePage from './manage/page'
import ZentralePage from './zentrale/page'

export default function AdminBoardWrapper(){
  const [view, setView] = useState<'applications'|'rules'|'trash'|'news'|'manage'|'zentrale'>('news')
  const [applicationCount, setApplicationCount] = useState(0)
  const [filter, setFilter] = useState("Offen")
  const [manageTab, setManageTab] = useState("berechtigungen")

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">
      <Sidebar setView={(v) => setView(v as any)} view={view} applicationCount={applicationCount} />
      <div className="flex flex-col flex-1">
        <Topbar view={view} filter={filter} setFilter={setFilter} manageTab={manageTab} />
        <div className="flex-1 overflow-auto">
          {view === 'news' && <NewsPage />}
          {view === 'applications' && <AdminBoardClient setApplicationCount={setApplicationCount} filter={filter} />}
          {view === 'rules' && <RulesPage />}
          {view === 'trash' && <div className="p-10 text-gray-400">Papierkorb kommt bald.</div>}
          {view === 'manage' && <ManagePage onTabChange={setManageTab} />}
          {view === 'zentrale' && <ZentralePage />}
        </div>
      </div>
    </div>
  )
}
