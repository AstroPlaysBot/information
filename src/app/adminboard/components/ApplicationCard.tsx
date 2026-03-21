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

  async function invite(){

    const newErrors = {
      date:!date,
      time:!time,
      channel:!channel
    }

    setErrors(newErrors)

    if(newErrors.date || newErrors.time || newErrors.channel) return

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
    setDate("")
    setTime("")
    setChannel("")

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

      <h2 className="text-lg font-semibold text-white">
        {app.name}
      </h2>

      <p className="text-sm text-purple-400">
        Bewerbung für {app.role}
      </p>

      <button
      onClick={()=>setOpen(!open)}
      className="text-purple-400 text-sm mt-4 hover:underline">
        {open ? "Antworten verbergen" : "Antworten anzeigen"}
      </button>

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

          {/* Datum */}

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
            }`}/>

          </div>

          {/* Uhrzeit */}

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
            }`}/>

          </div>

          {/* Sprachkanal */}

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
            }`}/>

          </div>

          {/* Buttons */}

          <div className="flex gap-2 pt-2">

            <button
            onClick={invite}
            className="flex-1 bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm">
              Einladung senden
            </button>

            <button
            onClick={()=>setInviteOpen(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm">
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
