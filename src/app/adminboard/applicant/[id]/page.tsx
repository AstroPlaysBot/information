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

  // FIX: Robuste Datums-Formatierung – behandelt String, Date-Objekt, ISO, Timestamp
  function formatDate(value: any): string {
    if (value === null || value === undefined || value === "") return "Datum unbekannt"
    // Prisma Json-Feld kann { $date: "..." } oder direkt ein ISO-String sein
    let raw = value
    if (typeof raw === "object" && raw !== null && "$date" in raw) {
      raw = raw["$date"]
    }
    const date = new Date(raw)
    if (isNaN(date.getTime())) return "Datum unbekannt"
    return `${date.toLocaleDateString('de-DE')} um ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
  }

  function formatDateShort(value: any): string {
    if (!value) return "—"
    const date = new Date(value)
    if (isNaN(date.getTime())) return "—"
    return `${date.toLocaleDateString('de-DE')}, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
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

  // Letzter verschobener Termin aus oldInterviews
  const oldInterviews: any[] = Array.isArray(app.oldInterviews)
    ? app.oldInterviews
    : (typeof app.oldInterviews === "string" ? JSON.parse(app.oldInterviews || "[]") : [])
  const lastOld = oldInterviews.length > 0 ? oldInterviews[oldInterviews.length - 1] : null

  const wasRescheduled = !!lastOld && !!interviewTime

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

  // Datetime-local min: jetzt
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

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

            {/* Interview-Anzeige mit Verschoben-Logik */}
            {interviewTime && (
              <div className="mt-1 space-y-1">
                <p className="font-semibold text-gray-300">Interview:</p>
                {wasRescheduled && lastOld ? (
                  <>
                    {/* Alter Termin durchgestrichen */}
                    <p className="line-through text-gray-500 text-sm">
                      {formatDateShort(lastOld.date)}
                      {lastOld.place ? ` · ${lastOld.place}` : ""}
                    </p>
                    {/* Neuer Termin */}
                    <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg p-2 text-sm space-y-0.5">
                      <p className="text-yellow-400 font-semibold text-xs uppercase tracking-wide">Verschoben</p>
                      <p className="text-white">{formatDateShort(app.interviewDate)}</p>
                      {app.interviewPlace && <p className="text-gray-300">📍 {app.interviewPlace}</p>}
                      <p className="text-gray-400 text-xs">
                        Grund: {lastOld.reason ? lastOld.reason : "Grund wurde nicht genannt"}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-200 text-sm">
                    {formatDateShort(app.interviewDate)}
                    {app.interviewPlace ? ` · ${app.interviewPlace}` : ""}
                  </p>
                )}
              </div>
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
              .sort((a:any, b:any) => {
                const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0
                const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0
                return db - da
              })
              .map((n:any,i:number)=>(
                <div key={i} className="bg-gray-800 p-3 rounded">
                  <p>{n.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    — von {n.author || "Unbekannt"} am {formatDate(n.createdAt)}
                  </p>
                </div>
              ))
            }
          </div>

        </div>
      </div>

      {/* Invite Modal – verbessertes UI */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold">📅 Einladung planen</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Datum</label>
                <input
                  type="date"
                  min={nowLocal.slice(0,10)}
                  value={inviteData.date ? inviteData.date.slice(0,10) : ""}
                  onChange={e => setInviteData(prev => ({
                    ...prev,
                    date: e.target.value + (prev.date.slice(10) || "T00:00")
                  }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Uhrzeit</label>
                <input
                  type="time"
                  value={inviteData.date ? inviteData.date.slice(11,16) : ""}
                  onChange={e => setInviteData(prev => ({
                    ...prev,
                    date: (prev.date.slice(0,10) || new Date().toISOString().slice(0,10)) + "T" + e.target.value
                  }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Ort / Plattform</label>
                <input
                  type="text"
                  placeholder="z.B. Discord Voice, TeamSpeak..."
                  value={inviteData.place}
                  onChange={e => setInviteData(prev => ({ ...prev, place: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Vorschau */}
            {inviteData.date && inviteData.place && (
              <div className="bg-blue-900/30 border border-blue-700/40 rounded-lg p-3 text-sm text-blue-200">
                <p className="font-semibold mb-1">Vorschau:</p>
                <p>📅 {formatDateShort(inviteData.date)}</p>
                <p>📍 {inviteData.place}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={sendInvite}
                disabled={sendingInvite || !inviteData.date || !inviteData.date.slice(11,16) || !inviteData.place}
                className="bg-green-600 px-5 py-2 rounded-lg disabled:opacity-50 flex-1 font-medium"
              >
                {sendingInvite ? "Wird gesendet..." : "Einladung senden"}
              </button>
              <button
                type="button"
                onClick={() => { setShowInviteModal(false); setInviteData({ date: "", place: "" }) }}
                className="bg-gray-700 px-5 py-2 rounded-lg flex-1"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal – verbessertes UI */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold">🔄 Termin verschieben</h2>

            {/* Aktueller Termin zur Orientierung */}
            {interviewTime && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Aktueller Termin</p>
                <p className="text-gray-200">{formatDateShort(app.interviewDate)}</p>
                {app.interviewPlace && <p className="text-gray-400">📍 {app.interviewPlace}</p>}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Neues Datum</label>
                <input
                  type="date"
                  min={nowLocal.slice(0,10)}
                  value={rescheduleData.date ? rescheduleData.date.slice(0,10) : ""}
                  onChange={e => setRescheduleData(prev => ({
                    ...prev,
                    date: e.target.value + (prev.date.slice(10) || "T00:00")
                  }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Neue Uhrzeit</label>
                <input
                  type="time"
                  value={rescheduleData.date ? rescheduleData.date.slice(11,16) : ""}
                  onChange={e => setRescheduleData(prev => ({
                    ...prev,
                    date: (prev.date.slice(0,10) || new Date().toISOString().slice(0,10)) + "T" + e.target.value
                  }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Neuer Ort / Plattform</label>
                <input
                  type="text"
                  placeholder="z.B. Discord Voice, TeamSpeak..."
                  value={rescheduleData.place}
                  onChange={e => setRescheduleData(prev => ({ ...prev, place: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Grund <span className="text-gray-500">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Grund für die Verschiebung..."
                  value={rescheduleData.reason}
                  onChange={e => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            {/* Vorschau */}
            {rescheduleData.date && rescheduleData.place && (
              <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg p-3 text-sm text-yellow-200">
                <p className="font-semibold mb-1">Neuer Termin:</p>
                <p>📅 {formatDateShort(rescheduleData.date)}</p>
                <p>📍 {rescheduleData.place}</p>
                <p>💬 {rescheduleData.reason || "Grund wurde nicht genannt"}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={sendReschedule}
                disabled={!rescheduleData.date || !rescheduleData.date.slice(11,16) || !rescheduleData.place}
                className="bg-yellow-600 px-5 py-2 rounded-lg disabled:opacity-50 flex-1 font-medium"
              >
                Verschieben
              </button>
              <button
                type="button"
                onClick={() => { setShowRescheduleModal(false); setRescheduleData({ date: "", place: "", reason: "" }) }}
                className="bg-gray-700 px-5 py-2 rounded-lg flex-1"
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
