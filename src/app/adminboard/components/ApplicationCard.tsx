'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ApplicationCard({app,reload}:any){

  const [open,setOpen] = useState(false)

  async function accept(){

    const date = prompt("Datum YYYY-MM-DD")
    const time = prompt("Zeit HH:MM")
    const place = prompt("Ort")

    if(!date||!time||!place) return

    await fetch('/api/adminboard/accept',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id:app.id,
        date:`${date}T${time}`,
        place
      })
    })

    reload()

  }

  async function reject(){

    if(!confirm("Ablehnen?")) return

    await fetch('/api/adminboard/reject',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:app.id})
    })

    reload()

  }

  async function remove(){

    await fetch('/api/adminboard/delete',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:app.id})
    })

    reload()

  }

  return (

    <motion.div
    whileHover={{scale:1.04}}
    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">

      <h2 className="text-lg font-semibold">
        {app.name}
      </h2>

      <p className="text-sm text-gray-400">{app.role}</p>

      <button
      onClick={()=>setOpen(!open)}
      className="text-purple-400 text-sm mt-3">
        Antworten anzeigen
      </button>

      {open && (

        <div className="mt-3 border-t border-gray-700 pt-3 space-y-2">

          {Object.entries(app.answers).map(([q,a]:any)=>(
            <div key={q}>
              <p className="text-xs text-gray-500">{q}</p>
              <p className="text-sm">{a}</p>
            </div>
          ))}

        </div>

      )}

      <div className="flex gap-2 mt-4">

        <button
        onClick={accept}
        className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded-lg text-sm">
          Annehmen
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

      </div>

    </motion.div>

  )
}
