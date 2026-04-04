'use client'

import { useEffect, useState } from 'react'
import ApplicationCard from './components/ApplicationCard'

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
  updatedAt?: string
  updatedBy?: string
}

interface Props {
  setApplicationCount: (count: number) => void
  filter: string
}

export default function AdminBoardClient({ setApplicationCount, filter }: Props) {

  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load(){
    const res = await fetch('/api/adminboard')
    const data = await res.json()

    setApplications(data.applications || [])
    setApplicationCount((data.applications || []).length)
  }

  const filteredApplications = applications.filter(app => {
    if(filter === "Alle") return true
    if(filter === "Offen") return app.status === "PENDING"
    if(filter === "Eingeladen") return app.status === "INTERVIEW"
    if(filter === "Eingestellt") return app.status === "ACCEPTED"
    if(filter === "Abgelehnt") return app.status === "REJECTED"
  })

  return (
    <div className="p-10 grid md:grid-cols-2 xl:grid-cols-3 gap-7">
      {filteredApplications.map(app => (
        <ApplicationCard
          key={app.id}
          app={app}
          reload={load}
        />
      ))}
    </div>
  )
}
