'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function ApplicationCard({ app, reload }: any) {

  const [open,setOpen] = useState(false)
  const [inviteOpen,setInviteOpen] = useState(false)

  const [date,setDate] = useState("")
  const [time,setTime] = useState("")
  const [channel,setChannel] = useState("")

  async function invite(){

    if(!date || !time || !channel) return alert("Bitte alles ausfüllen")

    await fetch('/api/adminboard/accept',{
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

        <span className="text-xs bg-gray-800 px-2 py-1 rounded">
          #{app.id}
        </span>

      </div>

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

        <button
        onClick={()=>setInviteOpen(true)}
        className="flex-1 bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm transition">
          Einladen
        </button>

        <button
        onClick={reject}
        className="flex-1 bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg text-sm transition">
          Ablehnen
        </button>

        <button
        onClick={remove}
        className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-lg text-sm transition">
          Löschen
        </button>

      </div>

      {/* Invite Modal */}

      <AnimatePresence>

      {inviteOpen && (

        <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">

          <motion.div
          initial={{scale:0.9,opacity:0}}
          animate={{scale:1,opacity:1}}
          exit={{scale:0.9,opacity:0}}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-[350px] space-y-4">

            <h3 className="text-lg font-semibold">
              Vorstellungsgespräch planen
            </h3>

            <div className="space-y-2">

              <label className="text-sm text-gray-400">
                Datum
              </label>

              <input
              type="date"
              value={date}
              onChange={e=>setDate(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded"/>

            </div>

            <div className="space-y-2">

              <label className="text-sm text-gray-400">
                Uhrzeit
              </label>

              <input
              type="time"
              value={time}
              onChange={e=>setTime(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded"/>

            </div>

            <div className="space-y-2">

              <label className="text-sm text-gray-400">
                Sprachkanal
              </label>

              <input
              placeholder="z.B. Discord: Bewerbungsgespräch"
              value={channel}
              onChange={e=>setChannel(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded"/>

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

    </motion.div>

  )

}
