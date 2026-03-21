'use client'

import { useEffect, useState } from 'react'
import ApplicationCard from './components/ApplicationCard'
import Topbar from './components/Topbar'

interface Application{
  id:string
  role:string
  name:string
  age:string
  email:string
  answers:Record<string,string>
  status?: string
  interviewDate?: string
  interviewPlace?: string
}

export default function AdminBoardClient({setApplicationCount}: any){

  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState("Alle")

  useEffect(() => {
    load()
  }, [])

  async function load(){
    const res = await fetch('/api/adminboard')
    const data = await res.json()

    setApplications(data.applications || [])
    setApplicationCount((data.applications || []).length)
  }

  // Gefilterte Anwendungen
  const filteredApplications = applications.filter(app => {
    if(filter === "Alle") return true
    if(filter === "Offen") return app.status === "PENDING"
    if(filter === "Eingeladen") return app.status === "INTERVIEW"
    if(filter === "Eingestellt") return app.status === "ACCEPTED"
    if(filter === "Abgelehnt") return app.status === "REJECTED"
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Topbar mit Filter */}
      <Topbar view="applications" filter={filter} setFilter={setFilter} />

      {/* Application Grid */}
      <div className="p-10 grid md:grid-cols-2 xl:grid-cols-3 gap-7">
        {filteredApplications.map(app => (
          <ApplicationCard
            key={app.id}
            app={app}
            reload={load}
          />
        ))}
      </div>

    </div>
  )
}
