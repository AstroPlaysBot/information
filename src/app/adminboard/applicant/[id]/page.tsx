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

  useEffect(()=>{
    if(id) load()
  },[id])

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

    if(!note.trim()) return

    await fetch('/adminboard/note',{
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

    <div className="min-h-screen p-10 text-white">

      <button
      onClick={()=>router.push('/adminboard')}
      className="mb-6 bg-blue-600 px-4 py-2 rounded">

        ← zurück

      </button>

      <div className="grid grid-cols-4 gap-6">

        {/* Angaben */}
        <div className="bg-gray-800 p-4 rounded space-y-3">

          <h3 className="font-semibold text-lg">
            Angaben:
          </h3>

          {Object.entries(app.answers || {}).map(([q,a]:any,i)=>(

            <div key={i}>

              <p className="text-gray-400 text-sm">
                {q}
              </p>

              <p>
                {a}
              </p>

            </div>

          ))}

        </div>


        {/* Interview */}
        <div className="bg-gray-800 p-4 rounded space-y-3">

          <h3 className="font-semibold text-lg">
            Interview:
          </h3>

          {app.interviewDate ? (

            <>
              <p>
                {new Date(app.interviewDate).toLocaleString()}
              </p>

              <p>
                {app.interviewPlace}
              </p>
            </>

          ) : (

            <p className="text-gray-400">
              Noch kein Interview geplant
            </p>

          )}

        </div>


        {/* Verwalten */}
        <div className="bg-gray-800 p-4 rounded space-y-3">

          <h3 className="font-semibold text-lg">
            Verwalten
          </h3>

          <button className="w-full bg-purple-600 py-2 rounded">
            Einladen
          </button>

          <button className="w-full bg-red-600 py-2 rounded">
            Ablehnen
          </button>

        </div>


        {/* Aktuell */}
        <div className="bg-gray-800 p-4 rounded">

          <h3 className="font-semibold text-lg mb-2">
            Aktuell:
          </h3>

          <p>
            {app.role || "Bewerber"}
          </p>

        </div>

      </div>


      {/* Notizen */}

      <div className="mt-10 space-y-4">

        <h3 className="text-lg font-semibold">
          Notizen:
        </h3>

        <div className="space-y-2">

          {Array.isArray(app.notes) && app.notes.map((n:any,i:number)=>(

            <div key={i} className="bg-gray-800 p-3 rounded">

              {typeof n === "object" ? (

                <>
                  <p className="text-sm text-purple-400">
                    {n.author} • {new Date(n.date).toLocaleString()}
                  </p>

                  <p>
                    {n.text}
                  </p>
                </>

              ) : (

                <p>{n}</p>

              )}

            </div>

          ))}

        </div>

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
