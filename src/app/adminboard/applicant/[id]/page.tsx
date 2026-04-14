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
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<any>(null)

  const [inviteData, setInviteData] = useState({ date: "", place: "" })
  const [sendingInvite, setSendingInvite] = useState(false)

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const [rescheduleData, setRescheduleData] = useState({ date: "", place: "", reason: "" })

  const discordId = session?.discordId || session?.user?.discordId
  const canFire = discordId === "1462891063202156807"

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
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/adminboard/${id}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "API Fehler beim Laden")
        setApp(null)
        return
      }

      setApp(data)

    } catch(e) {
      console.error(e)
      setError("Network Error / Server nicht erreichbar")
      setApp(null)
    }

    setLoading(false)
  }

  async function saveNote() {
    if (!note) return alert("Notiz darf nicht leer sein!")
    if (!session) return alert("Session fehlt!")

    try {
      const res = await fetch("/api/adminboard/note", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          note,
        })
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.error || "Fehler beim Speichern")
        return
      }

      setNote("")
      load()

    } catch (err) {
      console.error(err)
      alert("Fehler beim Speichern")
    }
  }

  async function sendInvite() {
    if(!inviteData.date || !inviteData.place) return
    if(sendingInvite) return

    setSendingInvite(true)

    try {
      const res = await fetch('/api/adminboard/invite',{
        method:'POST',
        credentials: "include",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          id,
          date: inviteData.date,
          place: inviteData.place,
        })
      })

      const data = await res.json()

      if(data.success) {
        setShowInviteModal(false)
        setInviteData({ date:"", place:"" })
        load()
      } else {
        alert(data.error || "Fehler beim Einladen")
      }

    } catch(e) {
      console.error(e)
      alert("Fehler beim Einladen")
    }

    setSendingInvite(false)
  }

  async function sendReschedule() {
    if(!rescheduleData.date || !rescheduleData.place) return

    try {
      const res = await fetch('/api/adminboard/reschedule',{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          id,
          date: rescheduleData.date,
          place: rescheduleData.place,
          reason: rescheduleData.reason
        })
      })

      const data = await res.json()

      if(data.success) {
        setShowRescheduleModal(false)
        setRescheduleData({ date:"", place:"", reason:"" })
        load()
      } else {
        alert(data.error || "Fehler beim Verschieben")
      }

    } catch(e) {
      console.error(e)
      alert("Fehler beim Verschieben")
    }
  }

  async function finishInterview() {
    try {
      const res = await fetch('/api/adminboard/interview-done',{
        method:'POST',
        credentials: "include",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ id })
      })

      const data = await res.json()

      if(!data.success){
        alert(data.error || "Fehler beim Beenden des Gesprächs")
        return
      }

      setApp((prev:any) => ({
        ...prev,
        status: "INTERVIEW_DONE"
      }))

    } catch(e) {
      console.error(e)
      alert("Fehler beim Beenden des Gesprächs")
    }
  }

  if(loading) return <div className="p-10 text-gray-400">Lade Bewerbung...</div>

  if(error) {
    return (
      <div className="p-10 text-red-400 space-y-3">
        <h1 className="text-xl font-bold">Fehler beim Laden</h1>
        <p>{error}</p>
        <button onClick={() => router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">
          ← Zurück
        </button>
        <button onClick={load} className="bg-gray-700 px-4 py-2 rounded ml-2">
          Retry
        </button>
      </div>
    )
  }

  if(!app) return <div className="p-10 text-red-400">Bewerbung konnte nicht geladen werden.</div>

  const answers =
    typeof app.answers === "string"
      ? JSON.parse(app.answers)
      : app.answers || {}

  const answerKeys = app.answersOrder || Object.keys(answers)

  const interviewTime: Date | null = app.interviewDate ? new Date(app.interviewDate) : null

  const isInvited = app.status === "INVITED"
  const interviewDone = app.status === "INTERVIEW_DONE"

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 text-white">

      {/* MODAL INVITE */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-[400px] space-y-3">
            <h2 className="text-lg font-bold">Einladung planen</h2>

            <input type="datetime-local"
              className="w-full p-2 bg-gray-800 rounded"
              value={inviteData.date}
              onChange={(e)=>setInviteData(prev=>({...prev, date:e.target.value}))}
            />

            <input
              className="w-full p-2 bg-gray-800 rounded"
              placeholder="Ort / Discord Kanal"
              value={inviteData.place}
              onChange={(e)=>setInviteData(prev=>({...prev, place:e.target.value}))}
            />

            <button onClick={sendInvite} className="bg-green-600 w-full py-2 rounded">
              Einladen bestätigen
            </button>

            <button onClick={()=>setShowInviteModal(false)} className="bg-gray-700 w-full py-2 rounded">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* MODAL RESCHEDULE */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-[400px] space-y-3">
            <h2 className="text-lg font-bold">Termin verschieben</h2>

            <input type="datetime-local"
              className="w-full p-2 bg-gray-800 rounded"
              value={rescheduleData.date}
              onChange={(e)=>setRescheduleData(prev=>({...prev, date:e.target.value}))}
            />

            <input
              className="w-full p-2 bg-gray-800 rounded"
              placeholder="Ort"
              value={rescheduleData.place}
              onChange={(e)=>setRescheduleData(prev=>({...prev, place:e.target.value}))}
            />

            <input
              className="w-full p-2 bg-gray-800 rounded"
              placeholder="Grund"
              value={rescheduleData.reason}
              onChange={(e)=>setRescheduleData(prev=>({...prev, reason:e.target.value}))}
            />

            <button onClick={sendReschedule} className="bg-yellow-600 w-full py-2 rounded">
              Verschieben bestätigen
            </button>

            <button onClick={()=>setShowRescheduleModal(false)} className="bg-gray-700 w-full py-2 rounded">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <button onClick={()=>router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">
        ← Zurück
      </button>

      <div className="grid grid-cols-4 gap-6">

        {/* VERWALTEN */}
        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Verwalten</h2>

          {app.status === "PENDING" && (
            <>
              <button onClick={()=>setShowInviteModal(true)} className="bg-green-600 w-full py-2 rounded mt-2">
                Einladung planen
              </button>

              <button onClick={async()=>{
                await fetch('/api/adminboard/reject',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({ id })
                })
                load()
              }} className="bg-red-600 w-full py-2 rounded mt-2">
                Ablehnen
              </button>
            </>
          )}

          {isInvited && (
            <>
              <button onClick={finishInterview} className="bg-blue-600 w-full py-2 rounded mt-2">
                Gespräch beendet
              </button>

              <button onClick={()=>setShowRescheduleModal(true)} className="bg-yellow-600 w-full py-2 rounded mt-2">
                Termin verschieben
              </button>
            </>
          )}

          {interviewDone && (
            <>
              <button className="bg-green-600 w-full py-2 rounded mt-2">
                Einstellen
              </button>

              <button className="bg-red-600 w-full py-2 rounded mt-2">
                Ablehnen
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
