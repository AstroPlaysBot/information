'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ApplicantPage(){

  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [app,setApp] = useState<any>(null)
  const [note,setNote] = useState("")
  const [loading,setLoading] = useState(true)

  const [session,setSession] = useState<any>(null)

  const canFire = session?.discordId === "1462891063202156807"

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  useEffect(()=>{
    loadSession()
    if(id) load()
  },[id])

  async function loadSession(){
    try{
      const res = await fetch("/api/check-auth")
      const data = await res.json()
      setSession(data)
    }catch{}
  }

  async function load(){

    try{

      const res = await fetch(`/api/adminboard/${id}`)

      if(!res.ok){
        console.error("API Fehler:", res.status)
        return
      }

      const data = await res.json()
      setApp(data)

    }catch(e){
      console.error("Fetch Fehler:",e)
    }

    setLoading(false)

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

  if(loading){
    return (
      <div className="p-10 text-gray-400">
        Lade Bewerbung...
      </div>
    )
  }

  if(!app){
    return (
      <div className="p-10 text-red-400">
        Bewerbung konnte nicht geladen werden.
      </div>
    )
  }

  return (

    <div className="p-10 max-w-7xl mx-auto space-y-10 text-white">

      <button
      onClick={()=>router.push('/adminboard')}
      className="bg-blue-600 px-4 py-2 rounded">

        ← Zurück

      </button>

      <div className="grid grid-cols-4 gap-6">

        {/* Angaben */}
        <div className="bg-gray-900 p-6 rounded space-y-3">

          <h2 className="text-lg font-bold">Angaben:</h2>

          {Object.entries(app.answers || {}).map(([q,a]:any,i)=>(
            <div key={i}>
              <p className="text-gray-400 text-sm">{q}</p>
              <p>{a}</p>
            </div>
          ))}

        </div>


        {/* Interview */}
        <div className="bg-gray-900 p-6 rounded space-y-3">

          <h2 className="text-lg font-bold">Interview:</h2>

          {!app.interviewDate && (
            <p className="text-gray-400">
              Noch kein Interview geplant
            </p>
          )}

          {app.interviewDate && (
            <>
              <p>{new Date(app.interviewDate).toLocaleString()}</p>
              <p>{app.interviewPlace}</p>
            </>
          )}

        </div>


        {/* Verwalten */}
        <div className="bg-gray-900 p-6 rounded space-y-3">

          <h2 className="text-lg font-bold">Verwalten</h2>

          {app.status === "PENDING" && (
            <>
              <button className="bg-green-600 w-full py-2 rounded">
                Einladen
              </button>

              <button className="bg-red-600 w-full py-2 rounded">
                Ablehnen
              </button>
            </>
          )}

          {app.status === "INVITED" && (
            <>
              <button className="bg-green-600 w-full py-2 rounded">
                Einstellen
              </button>

              <button className="bg-red-600 w-full py-2 rounded">
                Ablehnen
              </button>
            </>
          )}

          {app.status === "HIRED" && (

            <button
            disabled={!canFire}
            className={`w-full py-2 rounded ${
              canFire ? "bg-red-700" : "bg-gray-700 cursor-not-allowed"
            }`}>

              {canFire ? "Kündigen" : "🔒 Kündigen"}

            </button>

          )}

        </div>


        {/* Aktuell */}
        <div className="bg-gray-900 p-6 rounded space-y-3">

          <h2 className="text-lg font-bold">Aktuell:</h2>

          {app.status === "PENDING" && (
            <p>Bewerber</p>
          )}

          {app.status === "INVITED" && (
            <p>Interview Phase</p>
          )}

          {app.status === "HIRED" && (
            <p>{app.role}</p>
          )}

        </div>

      </div>


      {/* Notizen */}
      <div className="bg-gray-900 p-6 rounded space-y-4">

        <h2 className="text-lg font-bold">Notizen</h2>

        {Array.isArray(app.notes) && app.notes.map((n:any,i:number)=>(

          <div
          key={i}
          className="border-b border-gray-700 pb-2">

            {typeof n === "string" ? (
              <p>{n}</p>
            ) : (
              <>
                <p>{n.text}</p>
                <p className="text-xs text-gray-500">
                  von {n.by}
                </p>
              </>
            )}

          </div>

        ))}

        <textarea
        value={note}
        onChange={e=>setNote(e.target.value)}
        className="w-full bg-gray-800 p-3 rounded"
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
