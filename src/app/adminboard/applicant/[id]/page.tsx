'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ApplicantPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [app, setApp] = useState<any>(null)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  const [inviteData, setInviteData] = useState({ date: "", place: "" })
  const [sendingInvite, setSendingInvite] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [rescheduleData, setRescheduleData] = useState({ date: "", place: "", reason: "" })

  const canFire = session?.discordId === "1462891063202156807"

  useEffect(() => { window.scrollTo(0,0) }, [])

  useEffect(() => {
    loadSession()
    if(id) load()
  },[id])

  async function loadSession() {
    try{
      const res = await fetch("/api/check-auth")
      const data = await res.json()
      setSession(data)
    } catch {}
  }

  async function load() {
    try {
      const res = await fetch(`/api/adminboard/${id}`)
      if(!res.ok) return console.error("API Fehler:", res.status)
      const data = await res.json()
      setApp(data)
    } catch(e) {
      console.error("Fetch Fehler:", e)
    }
    setLoading(false)
  }

  async function saveNote() {
    if (!note) return alert("Notiz darf nicht leer sein!");
    if (!session) return alert("Session konnte nicht geladen werden!");

    try {
      const res = await fetch("/adminboard/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, note, author: session.user?.name || "[discordname]" })
      })
      const data = await res.json()
      if (!data.success) return alert("Notiz konnte nicht gespeichert werden: " + (data.error || ""))

      setNote("")
      load()
    } catch(err) {
      console.error("Fehler beim Speichern der Notiz:", err)
      alert("Fehler beim Speichern der Notiz")
    }
  }

  async function sendInvite() {
    if(!inviteData.date || !inviteData.place) return
    setSendingInvite(true)
    try {
      const localDate = new Date(inviteData.date)
      const isoDate = new Date(localDate.getTime() - localDate.getTimezoneOffset()*60000).toISOString()

      const res = await fetch('/api/adminboard/invite',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ id, date: isoDate, place: inviteData.place, admin: session?.user?.name || "[discordname]" })
      })
      const data = await res.json()
      if(data.success) {
        load()
        setShowInviteModal(false)
        setInviteData({ date: "", place: "" })
      }
    } catch(e) { console.error(e) }
    setSendingInvite(false)
  }

  async function rescheduleInterview() {
    if(!rescheduleData.date || !rescheduleData.place) return
    setSendingInvite(true)
    try {
      const localDate = new Date(rescheduleData.date)
      const isoDate = new Date(localDate.getTime() - localDate.getTimezoneOffset()*60000).toISOString()

      const res = await fetch('/api/adminboard/reschedule',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ id, date: isoDate, place: rescheduleData.place, reason: rescheduleData.reason, admin: session?.user?.name || "[discordname]" })
      })
      const data = await res.json()
      if(data.success) {
        load()
        setShowRescheduleModal(false)
        setRescheduleData({ date:"", place:"", reason:"" })
      }
    } catch(e) { console.error(e) }
    setSendingInvite(false)
  }

  if(loading) return <div className="p-10 text-gray-400">Lade Bewerbung...</div>
  if(!app) return <div className="p-10 text-red-400">Bewerbung konnte nicht geladen werden.</div>

  const answerKeys = app.answersOrder || Object.keys(app.answers || {})

  const interviewTime: Date | null = app.interviewDate ? new Date(app.interviewDate) : null
  const interviewPassed = interviewTime ? new Date() >= interviewTime : false

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 text-white">

      <button onClick={()=>router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">← Zurück</button>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Angaben:</h2>
          {answerKeys.map((key:any,i:number)=>(<div key={i}>
            <p className="text-gray-400 text-sm">{key}</p>
            <p>{app.answers[key]}</p>
          </div>))}
        </div>

        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Interview:</h2>
          {app.oldInterviews?.map((iv:any,i:number)=>(
            <p key={i} className="line-through text-gray-500">
              {new Date(iv.date).toLocaleString()} – {iv.place} (verschoben)
            </p>
          ))}
          {interviewTime ? <>
            <p>{interviewTime.toLocaleString()}</p>
            <p>{app.interviewPlace}</p>
          </> : <p className="text-gray-400">Noch kein Interview geplant</p>}
        </div>

        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Verwalten</h2>

          {app.status === "PENDING" && <>
            <button
              onClick={()=>setShowInviteModal(true)}
              className="bg-green-600 w-full py-2 rounded mt-2"
            >
              Einladung planen
            </button>
            <button
              onClick={async()=>{
                await fetch('/api/adminboard/reject',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({id,admin:session?.user?.name})
                })
                load()
              }}
              className="bg-red-600 w-full py-2 rounded mt-2"
            >
              Ablehnen
            </button>
          </>}

          {app.status === "INVITED" && (
            <>
              <p>Vorstellungsgespräch ausstehend</p>

              <button
                onClick={()=>setShowRescheduleModal(true)}
                className="bg-yellow-600 w-full py-2 rounded mt-2"
              >
                Gespräch verschieben
              </button>
            </>
          )}

          {app.status === "INVITED" && interviewPassed && <>
            <button
              onClick={async()=>{
                await fetch('/api/adminboard/hire',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({id,admin:session?.user?.name})
                })
                load()
              }}
              className="bg-green-600 w-full py-2 rounded mt-2"
            >
              Einstellen
            </button>
            <button
              onClick={async()=>{
                await fetch('/api/adminboard/reject',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({id,admin:session?.user?.name})
                })
                load()
              }}
              className="bg-red-600 w-full py-2 rounded mt-2"
            >
              Ablehnen
            </button>
          </>}

          {app.status === "HIRED" && (
            <button
              disabled={!canFire}
              className={`w-full py-2 rounded ${canFire ? "bg-red-700" : "bg-gray-700 cursor-not-allowed"}`}
            >
              {canFire ? "Kündigen" : "🔒 Kündigen"}
            </button>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Aktuell:</h2>
          {app.status !== "HIRED" && <p>Bewerber</p>}
          {app.status === "HIRED" && <p>{app.role}</p>}
        </div>

      </div>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded w-96 space-y-4">
            <h2 className="text-lg font-bold">Interview Einladung</h2>

            <input
              type="datetime-local"
              value={inviteData.date}
              onChange={e=>setInviteData({...inviteData,date:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />

            <input
              type="text"
              placeholder="Sprachkanal / Ort"
              value={inviteData.place}
              onChange={e=>setInviteData({...inviteData,place:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />

            <div className="flex gap-2 pt-2">
              <button
                disabled={!inviteData.date || !inviteData.place || sendingInvite}
                onClick={sendInvite}
                className="bg-green-600 flex-1 py-2 rounded disabled:opacity-50"
              >
                Einladen
              </button>

              <button
                onClick={()=>{
                  setShowInviteModal(false)
                  setInviteData({ date:"", place:"" })
                }}
                className="bg-gray-600 flex-1 py-2 rounded"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded w-96 space-y-4">
            <h2 className="text-lg font-bold">Gespräch verschieben</h2>

            <input
              type="datetime-local"
              value={rescheduleData.date}
              onChange={e=>setRescheduleData({...rescheduleData,date:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />

            <input
              type="text"
              placeholder="Sprachkanal / Ort"
              value={rescheduleData.place}
              onChange={e=>setRescheduleData({...rescheduleData,place:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />

            <textarea
              placeholder="Grund"
              value={rescheduleData.reason}
              onChange={e=>setRescheduleData({...rescheduleData,reason:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />

            <div className="flex gap-2 pt-2">
              <button
                disabled={!rescheduleData.date || !rescheduleData.place}
                onClick={rescheduleInterview}
                className="bg-yellow-600 flex-1 py-2 rounded disabled:opacity-50"
              >
                Speichern
              </button>

              <button
                onClick={()=>{
                  setShowRescheduleModal(false)
                  setRescheduleData({ date:"", place:"", reason:"" })
                }}
                className="bg-gray-600 flex-1 py-2 rounded"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 p-6 rounded space-y-4">
        <h2 className="text-lg font-bold">Notizen</h2>
        <textarea value={note} onChange={e=>setNote(e.target.value)}
          className="w-full bg-gray-800 p-3 rounded"/>
        <button onClick={saveNote} className="bg-purple-600 px-4 py-2 rounded">
          Notiz speichern
        </button>
      </div>

    </div>
  )
}
