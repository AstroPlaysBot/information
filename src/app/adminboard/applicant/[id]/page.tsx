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
        body: JSON.stringify({ id, note })
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
          date: new Date(inviteData.date).toISOString(),
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
          date: new Date(rescheduleData.date).toISOString(),
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
      setApp((prev:any) => ({ ...prev, status: "INTERVIEW_DONE" }))
    } catch(e) {
      console.error(e)
      alert("Fehler beim Beenden des Gesprächs")
    }
  }

  // FIX: Robuste Datums-Formatierung
  function formatDate(value: any): string {
    if (!value) return "Datum unbekannt"
    const date = new Date(value)
    if (isNaN(date.getTime())) return "Datum unbekannt"
    return `${date.toLocaleDateString('de-DE')} um ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`
  }

  if(loading) return <div className="p-10 text-gray-400">Lade Bewerbung...</div>

  if(error) {
    return (
      <div className="p-10 text-red-400 space-y-3">
        <h1 className="text-xl font-bold">Fehler beim Laden</h1>
        <p>{error}</p>
        <button onClick={() => router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">← Zurück</button>
        <button onClick={load} className="bg-gray-700 px-4 py-2 rounded ml-2">Retry</button>
      </div>
    )
  }

  if(!app) return <div className="p-10 text-red-400">Bewerbung konnte nicht geladen werden.</div>

  const answers =
    typeof app.answers === "string"
      ? JSON.parse(app.answers)
      : app.answers || {}

  const answerKeys = app.answersOrder || Object.keys(answers)

  const interviewTime: Date | null =
    app.interviewDate && !isNaN(new Date(app.interviewDate).getTime())
      ? new Date(app.interviewDate)
      : null

  const isInvited = app.status === "INVITED"
  const currentPosition = app.status === "HIRED" ? app.role : "Bewerber"
  const phoneAnswer = answers["Telefon erreichbar"] || "—"

  function statusColor(status:string){
    switch(status){
      case "PENDING": return "bg-yellow-600"
      case "INVITED": return "bg-blue-600"
      case "INTERVIEW_DONE": return "bg-purple-600"
      case "HIRED": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 text-white">

      <button type="button" onClick={()=>router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">
        ← Zurück
      </button>

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-3 space-y-6">

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold mb-3">Aktuelle Position</h2>
            <p className="text-xl font-semibold text-blue-400">{currentPosition}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-2">
            <h2 className="text-lg font-bold">Infos</h2>
            <p><b>Name:</b> {app.name}</p>
            <p><b>Rolle:</b> {app.role}</p>
            <p><b>Alter:</b> {app.age || "—"}</p>
            <p><b>Email:</b> {app.email || "—"}</p>
            <p><b>Telefon:</b> {phoneAnswer}</p>
            <p className="flex items-center gap-2">
              <b>Status:</b>
              <span className={`px-2 py-1 text-sm rounded ${statusColor(app.status)}`}>{app.status}</span>
            </p>
            {interviewTime && (
              <p><b>Interview:</b> {interviewTime.toLocaleString('de-DE')}</p>
            )}
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-3">
            <h2 className="text-lg font-bold">Verwalten</h2>

            {app.status === "PENDING" && (
              <>
                <button type="button" onClick={() => setShowInviteModal(true)} className="bg-green-600 w-full py-2 rounded">
                  Einladung planen
                </button>
                <button type="button" onClick={async()=>{
                  await fetch('/api/adminboard/reject',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id }) })
                  load()
                }} className="bg-red-600 w-full py-2 rounded">
                  Ablehnen
                </button>
              </>
            )}

            {isInvited && (
              <>
                <button type="button" onClick={finishInterview} className="bg-blue-600 w-full py-2 rounded">
                  Gespräch beendet
                </button>
                <button type="button" onClick={()=>setShowRescheduleModal(true)} className="bg-yellow-600 w-full py-2 rounded">
                  Termin verschieben
                </button>
              </>
            )}

            {app.status === "INTERVIEW_DONE" && (
              <>
                <button type="button" onClick={async()=>{
                  await fetch('/api/adminboard/hire',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id }) })
                  load()
                }} className="bg-green-600 w-full py-2 rounded">
                  Einstellen
                </button>
                <button type="button" onClick={async()=>{
                  await fetch('/api/adminboard/reject',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id }) })
                  load()
                }} className="bg-red-600 w-full py-2 rounded">
                  Ablehnen
                </button>
              </>
            )}
          </div>

        </div>

        <div className="col-span-9 space-y-6">

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 space-y-6">
            <h2 className="text-xl font-bold">Antworten</h2>
            {answerKeys
              .filter((key:string)=>!key.toLowerCase().includes("telefon"))
              .map((key:string)=>(
              <div key={key} className="border-b border-gray-800 pb-4">
                <p className="font-semibold text-gray-200 mb-1">{key}</p>
                <p className="text-gray-400 whitespace-pre-wrap">{answers[key]}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
            <h2 className="text-lg font-bold">Notizen</h2>
            <textarea
              value={note}
              onChange={(e)=>setNote(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded"
              placeholder="Neue Notiz..."
            />
            <button type="button" onClick={saveNote} className="bg-blue-600 px-4 py-2 rounded">
              Notiz speichern
            </button>
            {[...(app.notes || [])]
              .sort((a:any, b:any) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
              .map((n:any,i:number)=>(
                <div key={i} className="bg-gray-800 p-3 rounded">
                  <p>{n.text}</p>
                  {/* FIX: Robuste Datumsformatierung */}
                  <p className="text-xs text-gray-400 mt-1">
                    — von {n.author || "Unbekannt"} am {formatDate(n.createdAt)}
                  </p>
                </div>
              ))
            }
          </div>

        </div>
      </div>

      {/* FIX: Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold">Einladung planen</h2>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Datum & Uhrzeit</label>
              <input
                type="datetime-local"
                value={inviteData.date}
                onChange={e => setInviteData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 bg-gray-800 rounded text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Ort / Plattform</label>
              <input
                type="text"
                placeholder="z.B. Discord Voice, TeamSpeak..."
                value={inviteData.place}
                onChange={e => setInviteData(prev => ({ ...prev, place: e.target.value }))}
                className="w-full p-3 bg-gray-800 rounded text-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={sendInvite}
                disabled={sendingInvite || !inviteData.date || !inviteData.place}
                className="bg-green-600 px-5 py-2 rounded disabled:opacity-50 flex-1"
              >
                {sendingInvite ? "Wird gesendet..." : "Einladung senden"}
              </button>
              <button
                type="button"
                onClick={() => { setShowInviteModal(false); setInviteData({ date: "", place: "" }) }}
                className="bg-gray-700 px-5 py-2 rounded flex-1"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIX: Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold">Termin verschieben</h2>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Neues Datum & Uhrzeit</label>
              <input
                type="datetime-local"
                value={rescheduleData.date}
                onChange={e => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 bg-gray-800 rounded text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Neuer Ort / Plattform</label>
              <input
                type="text"
                placeholder="z.B. Discord Voice, TeamSpeak..."
                value={rescheduleData.place}
                onChange={e => setRescheduleData(prev => ({ ...prev, place: e.target.value }))}
                className="w-full p-3 bg-gray-800 rounded text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Grund (optional)</label>
              <input
                type="text"
                placeholder="Grund für Verschiebung..."
                value={rescheduleData.reason}
                onChange={e => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full p-3 bg-gray-800 rounded text-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={sendReschedule}
                disabled={!rescheduleData.date || !rescheduleData.place}
                className="bg-yellow-600 px-5 py-2 rounded disabled:opacity-50 flex-1"
              >
                Verschieben
              </button>
              <button
                type="button"
                onClick={() => { setShowRescheduleModal(false); setRescheduleData({ date: "", place: "", reason: "" }) }}
                className="bg-gray-700 px-5 py-2 rounded flex-1"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
