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
      const data = await res.json()
      setApp(data)
    } catch(e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function saveNote() {
    if (!note) return alert("Notiz darf nicht leer sein!")
    if (!session) return alert("Session fehlt!")

    try {
      const res = await fetch("/adminboard/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          note,
          author: session.user?.name || "[discordname]"
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

  // 🔥 FIX 1
  async function sendInvite() {
    if(!inviteData.date || !inviteData.place) return
    if(sendingInvite) return

    setSendingInvite(true)

    try {
      const res = await fetch('/api/adminboard/invite',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          id,
          date: inviteData.date,
          place: inviteData.place,
          admin: session?.user?.name || "[discordname]"
        })
      })

      const data = await res.json()

      if(data.success) {

        const updated = {
          ...app,
          status: "INVITED",
          interviewDate: inviteData.date,
          interviewPlace: inviteData.place
        }

        setApp(updated)

        setShowInviteModal(false)
        setInviteData({ date:"", place:"" })

        // 🔥 FIX: reload verzögert (sonst überschreibt DB kurz UI)
        setTimeout(() => load(), 800)

      } else {
        alert(data.error || "Fehler beim Einladen")
      }

    } catch(e) {
      console.error(e)
      alert("Fehler beim Einladen")
    }

    setSendingInvite(false)
  }

  async function rescheduleInterview() {
    if(!rescheduleData.date || !rescheduleData.place) return
    if(sendingInvite) return

    setSendingInvite(true)

    try {
      const res = await fetch('/api/adminboard/reschedule',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          id,
          date: rescheduleData.date,
          place: rescheduleData.place,
          reason: rescheduleData.reason,
          admin: session?.user?.name || "[discordname]"
        })
      })

      const data = await res.json()

      if(data.success) {
        load()
        setShowRescheduleModal(false)
        setRescheduleData({ date:"", place:"", reason:"" })
      } else {
        alert(data.error || "Fehler beim Verschieben")
      }

    } catch(e) {
      console.error(e)
      alert("Fehler beim Verschieben")
    }

    setSendingInvite(false)
  }

  // 🔥 FIX 2
  async function finishInterview() {
    try {
      await fetch('/api/adminboard/interview-done',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id, admin: session?.user?.name})
      })

      setApp((prev:any) => ({
        ...prev,
        status: "INTERVIEW_DONE"
      }))

      setTimeout(() => load(), 800)

    } catch(e) {
      console.error(e)
    }
  }

  if(loading) return <div className="p-10 text-gray-400">Lade Bewerbung...</div>
  if(!app) return <div className="p-10 text-red-400">Bewerbung konnte nicht geladen werden.</div>

  const answerKeys = app.answersOrder || Object.keys(app.answers || {})
  const interviewTime: Date | null = app.interviewDate ? new Date(app.interviewDate) : null

  // 🔥 FIX: robust statt nur "INTERVIEW_DONE"
  const isInvited = app.status === "INVITED" || app.interviewDate
  const interviewDone = app.status === "INTERVIEW_DONE"

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 text-white">

      <button onClick={()=>router.push('/adminboard')} className="bg-blue-600 px-4 py-2 rounded">
        ← Zurück
      </button>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Angaben:</h2>
          {answerKeys.map((key:any,i:number)=>(
            <div key={i}>
              <p className="text-gray-400 text-sm">{key}</p>
              <p>{app.answers[key]}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 p-6 rounded space-y-3">
          <h2 className="text-lg font-bold">Interview:</h2>

          {app.oldInterviews?.map((iv:any,i:number)=>(
            <p key={i} className="line-through text-gray-500">
              {new Date(iv.date).toLocaleString()} – {iv.place}
            </p>
          ))}

          {interviewTime ? (
            <>
              <p>{interviewTime.toLocaleString()}</p>
              <p>{app.interviewPlace}</p>
            </>
          ) : (
            <p className="text-gray-400">Noch kein Interview geplant</p>
          )}
        </div>

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
                  body:JSON.stringify({id,admin:session?.user?.name})
                })
                load()
              }} className="bg-red-600 w-full py-2 rounded mt-2">
                Ablehnen
              </button>
            </>
          )}

          {/* 🔥 FIX: statt nur INVITED */}
          {isInvited && (
            <>
              <button onClick={()=>setShowRescheduleModal(true)} className="bg-yellow-600 w-full py-2 rounded mt-2">
                Termin verschieben
              </button>

              <button onClick={finishInterview} className="bg-blue-600 w-full py-2 rounded mt-2">
                Gespräch beendet
              </button>
            </>
          )}

          {interviewDone && (
            <>
              <button onClick={async()=>{
                await fetch('/api/adminboard/hire',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({id,admin:session?.user?.name})
                })
                load()
              }} className="bg-green-600 w-full py-2 rounded mt-2">
                Einstellen
              </button>

              <button onClick={async()=>{
                await fetch('/api/adminboard/reject',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({id,admin:session?.user?.name})
                })
                load()
              }} className="bg-red-600 w-full py-2 rounded mt-2">
                Ablehnen
              </button>
            </>
          )}

          {app.status === "HIRED" && (
            <button disabled={!canFire} className={`w-full py-2 rounded ${canFire ? "bg-red-700" : "bg-gray-700 cursor-not-allowed"}`}>
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

      <div className="bg-gray-900 p-6 rounded space-y-4">
        <h2 className="text-lg font-bold">Notizen</h2>

        <textarea
          value={note}
          onChange={e=>setNote(e.target.value)}
          className="w-full bg-gray-800 p-3 rounded"
        />

        <button onClick={saveNote} className="bg-purple-600 px-4 py-2 rounded">
          Notiz speichern
        </button>
      </div>

      {/* MODALS bleiben 1:1 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-[400px] space-y-4">
            <h2 className="text-lg font-bold">Einladung zum Gespräch</h2>

            <input
              type="datetime-local"
              value={inviteData.date}
              onChange={(e)=>setInviteData({...inviteData, date:e.target.value})}
              className="w-full bg-gray-800 p-2 rounded"
            />

            <input
              type="text"
              placeholder="Ort / Sprachkanal"
              value={inviteData.place}
              onChange={(e)=>setInviteData({...inviteData, place:e.target.value})}
              className="w-full bg-gray-800 p-2 rounded"
            />

            <div className="flex gap-2">
              <button onClick={()=>setShowInviteModal(false)} className="bg-gray-700 w-full py-2 rounded">
                Abbrechen
              </button>

              <button
                onClick={sendInvite}
                disabled={!inviteData.date || !inviteData.place || sendingInvite}
                className="bg-green-600 w-full py-2 rounded disabled:opacity-50"
              >
                Einladen
              </button>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-[400px] space-y-4">
            <h2 className="text-lg font-bold">Termin verschieben</h2>

            <input
              type="datetime-local"
              value={rescheduleData.date}
              onChange={(e)=>setRescheduleData({...rescheduleData, date:e.target.value})}
              className="w-full bg-gray-800 p-2 rounded"
            />

            <input
              type="text"
              placeholder="Ort / Sprachkanal"
              value={rescheduleData.place}
              onChange={(e)=>setRescheduleData({...rescheduleData, place:e.target.value})}
              className="w-full bg-gray-800 p-2 rounded"
            />

            <textarea
              placeholder="Grund"
              value={rescheduleData.reason}
              onChange={(e)=>setRescheduleData({...rescheduleData, reason:e.target.value})}
              className="w-full bg-gray-800 p-2 rounded"
            />

            <div className="flex gap-2">
              <button onClick={()=>setShowRescheduleModal(false)} className="bg-gray-700 w-full py-2 rounded">
                Abbrechen
              </button>

              <button
                onClick={rescheduleInterview}
                disabled={!rescheduleData.date || !rescheduleData.place || sendingInvite}
                className="bg-yellow-600 w-full py-2 rounded disabled:opacity-50"
              >
                Verschieben
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
