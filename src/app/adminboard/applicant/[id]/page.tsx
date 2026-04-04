'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ApplicantPage(){

  const {id} = useParams()
  const router = useRouter()

  const [app,setApp] = useState<any>(null)
  const [note,setNote] = useState("")

  useEffect(()=>{
    load()
  },[])

  async function load(){

    const res = await fetch(`/api/adminboard/${id}`)
    const data = await res.json()

    setApp(data)

  }

  async function saveNote(){

    await fetch('/api/adminboard/note',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id,
        note
      })
    })

    setNote("")
    load()

  }

  if(!app) return null

  return (

    <div className="p-10 max-w-3xl mx-auto space-y-8">

      <button
      onClick={()=>router.push('/adminboard')}
      className="text-purple-400 flex gap-2 items-center">

        ← Zurück

      </button>

      <h1 className="text-2xl font-bold text-white">
        {app.name}
      </h1>

      <div className="space-y-3">

        {Object.entries(app.answers).map(([q,a]:any,i)=>(
          <div key={i}>
            <p className="text-gray-500 text-sm">{q}</p>
            <p className="text-gray-200">{a}</p>
          </div>
        ))}

      </div>

      {app.interviewDate && (

        <div className="bg-gray-900 p-4 rounded">

          <h3 className="text-purple-400 mb-2">Interview</h3>

          <p>{new Date(app.interviewDate).toLocaleString()}</p>
          <p>{app.interviewPlace}</p>

        </div>

      )}

      <div className="bg-gray-900 p-4 rounded space-y-3">

        <h3 className="text-purple-400">Admin Notizen</h3>

        {app.notes?.map((n:any,i:number)=>(
          <div key={i} className="text-sm text-gray-300">
            {n}
          </div>
        ))}

        <textarea
        value={note}
        onChange={e=>setNote(e.target.value)}
        className="w-full bg-gray-800 p-2 rounded"
        placeholder="Neue Notiz..."
        />

        <button
        onClick={saveNote}
        className="bg-purple-600 px-4 py-2 rounded">

          Notiz speichern

        </button>

      </div>

    </div>

  )

}
