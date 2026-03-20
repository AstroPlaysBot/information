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
}

export default function AdminBoardClient({setApplicationCount}:any){

  const [applications,setApplications] = useState<Application[]>([])

  useEffect(()=>{
    load()
  },[])

  async function load(){

    const res = await fetch('/api/adminboard')
    const data = await res.json()

    setApplications(data.applications || [])
    setApplicationCount((data.applications || []).length)

  }

  return (

    <div className="p-10 grid md:grid-cols-2 xl:grid-cols-3 gap-7">

      {applications.map(app => (
        <ApplicationCard
          key={app.id}
          app={app}
          reload={load}
        />
      ))}

    </div>

  )

}
