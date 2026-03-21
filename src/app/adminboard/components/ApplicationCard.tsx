'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function ApplicationCard({ app, reload }: any) {

  const [open,setOpen] = useState(false)
  const [inviteOpen,setInviteOpen] = useState(false)

  const [date,setDate] = useState("")
  const [time,setTime] = useState("")
  const [channel,setChannel] = useState("")

  const [errors,setErrors] = useState({
    date:false,
    time:false,
    channel:false
  })

  const status = app.status || "PENDING"

  function statusBadge(){

    if(status === "INTERVIEW")
      return <span className="text-xs bg-purple-600 px-2 py-1 rounded">Eingeladen</span>

    if(status === "ACCEPTED")
      return <span className="text-xs bg-green-600 px-2 py-1 rounded">Angenommen</span>

    if(status === "REJECTED")
      return <span className="text-xs bg-red-600 px-2 py-1 rounded">Abgelehnt</span>

    return <span className="text-xs bg-yellow-600 px-2 py-1 rounded">Neu</span>

  }

  async function invite(){

    const newErrors = {
      date:!date,
      time:!time,
      channel:!channel
    }

    setErrors(newErrors)

    if(newErrors.date || newErrors.time || newErrors.channel) return

    await fetch('/api/adminboard/invite',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id:app.id,
        date:`${date}T${time}`,
        place:channel
      })
    })

    setInviteOpen(false)
    reload()

  }

  async function hire(){

    await fetch('/api/adminboard/hire',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:app.id})
    })

    reload()

  }

  async function reject(){

    if(!confirm("Bewerbung wirklich ablehnen?")) return

    await fetch('/api/adminboard/reject',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:app.id})
    })

    reload()

  }

  async function remove(){

    if(!confirm("Bewerbung löschen?")) return

    await fetch('/api/adminboard/delete',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:app.id})
    })

    reload()

  }

  const answers = Object.entries(app.answers)

  return (

    <>

    <motion.div
    whileHover={{scale:1.03}}
    className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 shadow-xl">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-lg font-semibold text-white">
            {app.name}
          </h2>

          <p className="text-sm text-purple-400">
            Bewerbung für {app.role}
          </p>

        </div>

        {statusBadge()}

      </div>

      {/* Interview Infos */}

      {app.status === "INTERVIEW" && app.interviewDate && (
        <div className="mt-3 text-sm text-gray-300">

          <div>
            📅 {new Date(app.interviewDate).toLocaleDateString()}
          </div>

          <div>
            ⏰ {new Date(app.interviewDate).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
          </div>

          <div>
            🎤 {app.interviewPlace}
          </div>

        </div>
      )}

      {/* Toggle */}

      <button
      onClick={()=>setOpen(!open)}
      className="text-purple-400 text-sm mt-4 hover:underline">
        {open ? "Antworten verbergen" : "Antworten anzeigen"}
      </button>

      {/* Antworten */}

      <AnimatePresence>

      {open && (

        <motion.div
        initial={{opacity:0,y:-5}}
        animate={{opacity:1,y:0}}
        exit={{opacity:0}}
        className="mt-4 border-t border-gray-800 pt-4 space-y-3">

          {answers.map(([question,answer]:any,index)=>(

            <div key={index}>

              <p className="text-xs text-gray-500">
                {question}
              </p>

              <p className="text-sm text-gray-200 whitespace-pre-line">
                {answer}
              </p>

            </div>

          ))}

        </motion.div>

      )}

      </AnimatePresence>

      {/* Buttons */}

      <div className="flex gap-2 mt-6">

        {status === "PENDING" && (
          <>
            <button
            onClick={()=>setInviteOpen(true)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm">
              Einladen
            </button>

            <button
            onClick={reject}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg text-sm">
              Ablehnen
            </button>

            <button
            onClick={remove}
            className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-lg text-sm">
              Löschen
            </button>
          </>
        )}

        {status === "INTERVIEW" && (
          <>
            <button
            onClick={hire}
            className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded-lg text-sm">
              Einstellen
            </button>

            <button
            onClick={reject}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg text-sm">
              Ablehnen
            </button>
          </>
        )}

        {status === "ACCEPTED" && (
          <div className="w-full text-center bg-green-700 p-2 rounded text-sm">
            Mitarbeiter eingestellt
          </div>
        )}

        {status === "REJECTED" && (
          <div className="w-full text-center bg-red-700 p-2 rounded text-sm">
            Bewerbung abgelehnt
          </div>
        )}

      </div>

    </motion.div>


    {/* MODAL */}

    <AnimatePresence>

    {inviteOpen && (

      <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">

        <motion.div
        initial={{scale:0.9,opacity:0}}
        animate={{scale:1,opacity:1}}
        exit={{scale:0.9,opacity:0}}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-[380px] space-y-4">

          <h3 className="text-lg font-semibold text-white">
            Vorstellungsgespräch planen
          </h3>

          <div className="space-y-1">

            <label className="text-sm text-gray-400">
              Datum
            </label>

            <input
            type="date"
            value={date}
            onChange={e=>{
              setDate(e.target.value)
              setErrors({...errors,date:false})
            }}
            className={`w-full p-2 rounded bg-gray-800 border ${
              errors.date ? "border-red-500" : "border-gray-700"
            }`}
            />

          </div>

          <div className="space-y-1">

            <label className="text-sm text-gray-400">
              Uhrzeit
            </label>

            <input
            type="time"
            value={time}
            onChange={e=>{
              setTime(e.target.value)
              setErrors({...errors,time:false})
            }}
            className={`w-full p-2 rounded bg-gray-800 border ${
              errors.time ? "border-red-500" : "border-gray-700"
            }`}
            />

          </div>

          <div className="space-y-1">

            <label className="text-sm text-gray-400">
              Sprachkanal
            </label>

            <input
            placeholder="z.B. Discord Bewerbungsgespräch"
            value={channel}
            onChange={e=>{
              setChannel(e.target.value)
              setErrors({...errors,channel:false})
            }}
            className={`w-full p-2 rounded bg-gray-800 border ${
              errors.channel ? "border-red-500" : "border-gray-700"
            }`}
            />

          </div>

          <div className="flex gap-2 pt-2">

            <button
            onClick={invite}
            className="flex-1 bg-purple-600 hover:bg-purple-700 p-2 rounded">
              Einladung senden
            </button>

            <button
            onClick={()=>setInviteOpen(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded">
              Abbrechen
            </button>

          </div>

        </motion.div>

      </motion.div>

    )}

    </AnimatePresence>

    </>

  )

}
