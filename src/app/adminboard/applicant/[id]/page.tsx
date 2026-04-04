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

  const canFire = session?.discordId === "1462891063202156807"

  useEffect(() => {
    window.scrollTo(0,0)
  },[])

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

  // ================================
  // Notiz speichern
  // ================================
  async function saveNote() {
    if (!note) return alert("Notiz darf nicht leer sein!");
    if (!session) return alert("Session konnte nicht geladen werden!");

    const adminName = session.user?.name || "Admin"

    try {
      const res = await fetch("/api/adminboard/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, note, admin: adminName })
      })

      const data = await res.json()
      if (!data.success) return alert("Notiz konnte nicht gespeichert werden: " + (data.error || ""))

      setNote("") // Textfeld leeren
      load()      // Bewerbung neu laden
    } catch(err) {
      console.error("Fehler beim Speichern der Notiz:", err)
      alert("Fehler beim Speichern der Notiz")
    }
  }

  async function sendInvite() {
    if(!inviteData.date || !inviteData.place) return alert("Datum & Sprachkanal angeben!")
    setSendingInvite(true)
    try {
      const res = await fetch('/api/adminboard/invite',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ id, date: inviteData.date, place: inviteData.place, admin: session?.user?.name || "Admin" })
      })
      const data = await res.json()
      if(data.success) load()
    } catch(e) { console.error(e) }
    setSendingInvite(false)
  }

  if(loading) return <div className="p-10 text-gray-400">Lade Bewerbung...</div>
  if(!app) return <div className="p-10 text-red-400">Bewerbung konnte nicht geladen werden.</div>

  const answerKeys = app.answersOrder || Object.keys(app.answers || {})
  const now = new Date()
  const interviewTime = app.interviewDate ? new Date(app.interviewDate) : null
  const interviewPassed = interviewTime ? now >= interviewTime : false

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 text-white">

      <button onClick={()=>router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">← Zurück</button>

      <div className="grid grid-cols-4 gap-6">

        {/* Angaben */}
        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Angaben:</h2>
          {answerKeys.map((key:any,i:number)=>(<div key={i}>
            <p className="text-gray-400 text-sm">{key}</p>
            <p>{app.answers[key]}</p>
          </div>))}
        </div>

        {/* Interview */}
        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Interview:</h2>
          {app.interviewDate ? <>
            <p>{new Date(app.interviewDate).toLocaleString()}</p>
            <p>{app.interviewPlace}</p>
          </> : <p className="text-gray-400">Noch kein Interview geplant</p>}
        </div>

        {/* Verwalten */}
        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Verwalten</h2>

          {app.status === "PENDING" && <>
            {/* Invite Formular */}
            <input
              type="datetime-local"
              value={inviteData.date}
              onChange={e=>setInviteData({...inviteData, date:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />
            <input
              type="text"
              placeholder="Sprachkanal"
              value={inviteData.place}
              onChange={e=>setInviteData({...inviteData, place:e.target.value})}
              className="w-full p-2 rounded bg-gray-800"
            />
            <button
              onClick={sendInvite}
              disabled={sendingInvite}
              className="bg-green-600 w-full py-2 rounded mt-2"
            >
              {sendingInvite ? "Sende Einladung..." : "Einladen"}
            </button>

            <button
              onClick={async()=>{await fetch('/api/adminboard/reject',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,admin:session?.user?.name})}); load()}}
              className="bg-red-600 w-full py-2 rounded mt-2"
            >
              Ablehnen
            </button>
          </>}

          {app.status === "INVITED" && !interviewPassed && (
            <p>Gespräch ausstehend</p>
          )}

          {app.status === "INVITED" && interviewPassed && <>
            <button
              onClick={async()=>{await fetch('/api/adminboard/hire',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,admin:session?.user?.name})}); load()}}
              className="bg-green-600 w-full py-2 rounded mt-2"
            >
              Einstellen
            </button>
            <button
              onClick={async()=>{await fetch('/api/adminboard/reject',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,admin:session?.user?.name})}); load()}}
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

        {/* Aktuell */}
        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Aktuell:</h2>
          {app.status === "PENDING" && <p>Bewerber</p>}
          {app.status === "INVITED" && !interviewPassed && <p>Interview Phase</p>}
          {app.status === "INVITED" && interviewPassed && <p>Nach Interview</p>}
          {app.status === "HIRED" && <p>{app.role}</p>}
        </div>

      </div>

      {/* Notizen */}
      <div className="bg-gray-900 p-6 rounded space-y-4">
        <h2 className="text-lg font-bold">Notizen</h2>

        {/* Notizen mit Default-Array */}
        {(Array.isArray(app.notes) ? app.notes : []).map((n:any,i:number)=>(
          <div key={i} className="border-b border-gray-700 pb-2">
            {typeof n === "string" ? (
              <p>{n}</p>
            ) : (
              <>
                <p>{n.text}</p>
                <p className="text-xs text-gray-500">
                  von {n.author} am {new Date(n.date).toLocaleString()}
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
        <button onClick={saveNote} className="bg-purple-600 px-4 py-2 rounded">
          Notiz speichern
        </button>
      </div>

    </div>
  )
}
