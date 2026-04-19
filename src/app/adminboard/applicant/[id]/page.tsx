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
  const [savingNote, setSavingNote] = useState(false)

  const [inviteData, setInviteData] = useState({ date: "", place: "" })
  const [sendingInvite, setSendingInvite] = useState(false)

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const [rescheduleData, setRescheduleData] = useState({ date: "", place: "", reason: "" })

  const discordId = session?.discordId || session?.user?.discordId
  const discordName = session?.username || session?.user?.username || session?.global_name || "Unbekannt"
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
    if (!note.trim()) return alert("Notiz darf nicht leer sein!")
    if (!session) return alert("Session fehlt!")
    setSavingNote(true)
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
    setSavingNote(false)
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

  function formatDate(value: any): string {
    if (value === null || value === undefined || value === "") return "Datum unbekannt"
    let raw = value
    if (typeof raw === "object" && raw !== null && "$date" in raw) raw = raw["$date"]
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

  if(loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Lade Bewerbung...</p>
      </div>
    </div>
  )

  if(error) {
    return (
      <div className="min-h-screen bg-gray-950 p-10">
        <div className="max-w-md mx-auto bg-gray-900 border border-red-900/50 rounded-2xl p-8 space-y-4">
          <h1 className="text-xl font-bold text-red-400">Fehler beim Laden</h1>
          <p className="text-gray-400 text-sm">{error}</p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/adminboard')} className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-medium">← Zurück</button>
            <button onClick={load} className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg text-sm">Retry</button>
          </div>
        </div>
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

  const oldInterviews: any[] = Array.isArray(app.oldInterviews)
    ? app.oldInterviews
    : (typeof app.oldInterviews === "string" ? JSON.parse(app.oldInterviews || "[]") : [])
  const lastOld = oldInterviews.length > 0 ? oldInterviews[oldInterviews.length - 1] : null
  const wasRescheduled = !!lastOld && !!interviewTime

  const isInvited = app.status === "INVITED"
  const currentPosition = app.status === "HIRED" ? app.role : "Bewerber"
  const phoneAnswer = answers["Telefon erreichbar"] || "—"

  function statusColor(status: string) {
    switch(status){
      case "PENDING": return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
      case "INVITED": return "bg-blue-500/15 text-blue-400 border border-blue-500/30"
      case "INTERVIEW_DONE": return "bg-purple-500/15 text-purple-400 border border-purple-500/30"
      case "HIRED": return "bg-green-500/15 text-green-400 border border-green-500/30"
      default: return "bg-gray-500/15 text-gray-400 border border-gray-500/30"
    }
  }

  function statusLabel(status: string) {
    switch(status){
      case "PENDING": return "Ausstehend"
      case "INVITED": return "Eingeladen"
      case "INTERVIEW_DONE": return "Interview fertig"
      case "HIRED": return "Eingestellt"
      default: return status
    }
  }

  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  const sortedNotes = [...(app.notes || [])].sort((a: any, b: any) => {
    const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0
    const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0
    return db - da
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/adminboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white transition"
          >
            ← Zurück
          </button>
          <div>
            <h1 className="text-xl font-bold">{app.name}</h1>
            <p className="text-sm text-gray-500">{app.role} · Bewerbungs-ID: {app.id?.slice(0,8)}...</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusColor(app.status)}`}>
              {statusLabel(app.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">

          {/* Left column */}
          <div className="col-span-3 space-y-4">

            {/* Position */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Position</p>
              <p className="text-lg font-semibold text-blue-400">{currentPosition}</p>
            </div>

            {/* Infos */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Bewerberdaten</p>
              {[
                { label: "Name", value: app.name },
                { label: "Rolle", value: app.role },
                { label: "Alter", value: app.age || "—" },
                { label: "E-Mail", value: app.email || "—" },
                { label: "Telefon", value: phoneAnswer },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-2 text-sm border-b border-gray-800/60 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500 shrink-0">{label}</span>
                  <span className="text-gray-200 text-right break-all">{value}</span>
                </div>
              ))}
            </div>

            {/* Interview */}
            {interviewTime && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Interview</p>
                {wasRescheduled && lastOld ? (
                  <>
                    <div className="text-sm text-gray-600 line-through leading-relaxed">
                      <p>{formatDateShort(lastOld.date)}</p>
                      {lastOld.place && <p>📍 {lastOld.place}</p>}
                      {lastOld.scheduledBy && (
                        <p className="text-xs">Geplant von: {lastOld.scheduledBy}</p>
                      )}
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-sm space-y-1.5">
                      <p className="text-yellow-400 font-semibold text-xs uppercase tracking-wider">Verschoben</p>
                      <p className="text-white font-medium">{formatDateShort(app.interviewDate)}</p>
                      {app.interviewPlace && <p className="text-gray-300 text-xs">📍 {app.interviewPlace}</p>}
                      {app.scheduledBy && (
                        <p className="text-gray-400 text-xs">👤 Geplant von: <span className="text-gray-300">{app.scheduledBy}</span></p>
                      )}
                      <p className="text-gray-500 text-xs border-t border-yellow-500/20 pt-1.5">
                        Grund: {lastOld.reason || "Grund wurde nicht genannt"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-sm space-y-1">
                    <p className="text-white font-medium">{formatDateShort(app.interviewDate)}</p>
                    {app.interviewPlace && <p className="text-gray-400 text-xs">📍 {app.interviewPlace}</p>}
                    {app.scheduledBy && (
                      <p className="text-gray-500 text-xs">👤 Geplant von: <span className="text-gray-400">{app.scheduledBy}</span></p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Aktionen */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Aktionen</p>

              {app.status === "PENDING" && (
                <>
                  <button type="button" onClick={() => setShowInviteModal(true)}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-500 transition rounded-xl text-sm font-semibold">
                    Einladung planen
                  </button>
                  <button type="button" onClick={async () => {
                    await fetch('/api/adminboard/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
                    load()
                  }} className="w-full py-2.5 bg-red-600/80 hover:bg-red-600 transition rounded-xl text-sm font-semibold">
                    Ablehnen
                  </button>
                </>
              )}

              {isInvited && (
                <>
                  <button type="button" onClick={finishInterview}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 transition rounded-xl text-sm font-semibold">
                    Gespräch beendet
                  </button>
                  <button type="button" onClick={() => setShowRescheduleModal(true)}
                    className="w-full py-2.5 bg-yellow-600/80 hover:bg-yellow-600 transition rounded-xl text-sm font-semibold">
                    Termin verschieben
                  </button>
                </>
              )}

              {app.status === "INTERVIEW_DONE" && (
                <>
                  <button type="button" onClick={async () => {
                    await fetch('/api/adminboard/hire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
                    load()
                  }} className="w-full py-2.5 bg-green-600 hover:bg-green-500 transition rounded-xl text-sm font-semibold">
                    Einstellen
                  </button>
                  <button type="button" onClick={async () => {
                    await fetch('/api/adminboard/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
                    load()
                  }} className="w-full py-2.5 bg-red-600/80 hover:bg-red-600 transition rounded-xl text-sm font-semibold">
                    Ablehnen
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Right column */}
          <div className="col-span-9 space-y-5">

            {/* Antworten */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 space-y-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Bewerbungsantworten</p>
              {answerKeys
                .filter((key: string) => !key.toLowerCase().includes("telefon"))
                .map((key: string) => (
                  <div key={key} className="border-b border-gray-800/70 pb-5 last:border-0 last:pb-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{key}</p>
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{answers[key]}</p>
                  </div>
                ))}
            </div>

            {/* Notizen */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 space-y-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Notizen</p>

              {/* Eingabe */}
              <div className="space-y-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveNote()
                  }}
                  rows={3}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none transition"
                  placeholder="Neue Notiz... (Strg+Enter zum Speichern)"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={saveNote}
                    disabled={savingNote || !note.trim()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition rounded-lg text-sm font-semibold"
                  >
                    {savingNote ? "Speichern..." : "Notiz speichern"}
                  </button>
                </div>
              </div>

              {/* Notizliste */}
              {sortedNotes.length === 0 && (
                <p className="text-center text-gray-600 text-sm py-4">Noch keine Notizen vorhanden.</p>
              )}
              <div className="space-y-3">
                {sortedNotes.map((n: any, i: number) => (
                  <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{n.text}</p>
                    <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-700/50">
                      <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-bold">
                        {(n.author || "?")[0].toUpperCase()}
                      </div>
                      <p className="text-xs text-gray-500">
                        <span className="text-gray-400 font-medium">{n.author || "Unbekannt"}</span>
                        {n.authorId && <span className="text-gray-600 ml-1">({n.authorId})</span>}
                        {" · "}
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-7 w-full max-w-md space-y-5 shadow-2xl">
            <div>
              <h2 className="text-lg font-bold">Einladung planen</h2>
              <p className="text-xs text-gray-500 mt-0.5">Wähle Datum, Uhrzeit und Ort für das Interview</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</label>
                <input type="date" min={nowLocal.slice(0,10)}
                  value={inviteData.date ? inviteData.date.slice(0,10) : ""}
                  onChange={e => setInviteData(prev => ({ ...prev, date: e.target.value + (prev.date.slice(10) || "T00:00") }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Uhrzeit</label>
                <input type="time"
                  value={inviteData.date ? inviteData.date.slice(11,16) : ""}
                  onChange={e => setInviteData(prev => ({ ...prev, date: (prev.date.slice(0,10) || new Date().toISOString().slice(0,10)) + "T" + e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ort / Plattform</label>
                <input type="text" placeholder="z.B. Discord Voice, TeamSpeak..."
                  value={inviteData.place}
                  onChange={e => setInviteData(prev => ({ ...prev, place: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {inviteData.date && inviteData.place && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 text-sm space-y-1">
                <p className="text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">Vorschau</p>
                <p className="text-gray-200">📅 {formatDateShort(inviteData.date)}</p>
                <p className="text-gray-200">📍 {inviteData.place}</p>
                <p className="text-gray-400 text-xs">👤 Geplant von: {discordName}{discordId ? ` (${discordId})` : ""}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={sendInvite}
                disabled={sendingInvite || !inviteData.date || !inviteData.date.slice(11,16) || !inviteData.place}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition px-5 py-2.5 rounded-xl text-sm font-semibold flex-1">
                {sendingInvite ? "Wird gesendet..." : "Einladung senden"}
              </button>
              <button type="button"
                onClick={() => { setShowInviteModal(false); setInviteData({ date: "", place: "" }) }}
                className="bg-gray-800 hover:bg-gray-700 transition px-5 py-2.5 rounded-xl text-sm flex-1">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-7 w-full max-w-md space-y-5 shadow-2xl">
            <div>
              <h2 className="text-lg font-bold">Termin verschieben</h2>
              <p className="text-xs text-gray-500 mt-0.5">Der alte Termin wird als verschoben markiert</p>
            </div>

            {interviewTime && (
              <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-3.5 text-sm">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Aktueller Termin</p>
                <p className="text-gray-300">{formatDateShort(app.interviewDate)}</p>
                {app.interviewPlace && <p className="text-gray-500 text-xs mt-0.5">📍 {app.interviewPlace}</p>}
                {app.scheduledBy && <p className="text-gray-600 text-xs mt-0.5">👤 {app.scheduledBy}</p>}
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Neues Datum</label>
                <input type="date" min={nowLocal.slice(0,10)}
                  value={rescheduleData.date ? rescheduleData.date.slice(0,10) : ""}
                  onChange={e => setRescheduleData(prev => ({ ...prev, date: e.target.value + (prev.date.slice(10) || "T00:00") }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Neue Uhrzeit</label>
                <input type="time"
                  value={rescheduleData.date ? rescheduleData.date.slice(11,16) : ""}
                  onChange={e => setRescheduleData(prev => ({ ...prev, date: (prev.date.slice(0,10) || new Date().toISOString().slice(0,10)) + "T" + e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Neuer Ort / Plattform</label>
                <input type="text" placeholder="z.B. Discord Voice, TeamSpeak..."
                  value={rescheduleData.place}
                  onChange={e => setRescheduleData(prev => ({ ...prev, place: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Grund <span className="text-gray-600 normal-case">(optional)</span>
                </label>
                <input type="text" placeholder="Grund für die Verschiebung..."
                  value={rescheduleData.reason}
                  onChange={e => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
            </div>

            {rescheduleData.date && rescheduleData.place && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3.5 text-sm space-y-1">
                <p className="text-yellow-400 font-semibold text-xs uppercase tracking-wider mb-1">Neuer Termin</p>
                <p className="text-gray-200">📅 {formatDateShort(rescheduleData.date)}</p>
                <p className="text-gray-200">📍 {rescheduleData.place}</p>
                <p className="text-gray-400 text-xs">👤 Verschoben von: {discordName}{discordId ? ` (${discordId})` : ""}</p>
                <p className="text-gray-500 text-xs">💬 {rescheduleData.reason || "Grund wurde nicht genannt"}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={sendReschedule}
                disabled={!rescheduleData.date || !rescheduleData.date.slice(11,16) || !rescheduleData.place}
                className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed transition px-5 py-2.5 rounded-xl text-sm font-semibold flex-1">
                Verschieben
              </button>
              <button type="button"
                onClick={() => { setShowRescheduleModal(false); setRescheduleData({ date: "", place: "", reason: "" }) }}
                className="bg-gray-800 hover:bg-gray-700 transition px-5 py-2.5 rounded-xl text-sm flex-1">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
