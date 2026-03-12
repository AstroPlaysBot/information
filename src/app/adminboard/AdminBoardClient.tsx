'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Application {
  id: string;
  role: string;
  name: string;
  age: string;
  email: string;
  answers: Record<string, string>;
  submittedAt: string;
}

const roleColors: Record<string, string> = {
  'Beta Tester': 'bg-purple-600',
  'Moderator': 'bg-indigo-600',
  'Frontend Developer': 'bg-green-600',
  'Backend Developer': 'bg-red-600',
  'Praktikant': 'bg-yellow-600',
  'Promotion Manager': 'bg-pink-600',
};

export default function AdminBoardClient() {

  const [applications,setApplications] = useState<Application[]>([])
  const [loading,setLoading] = useState(true)
  const [expanded,setExpanded] = useState<string|null>(null)

  useEffect(()=>{
    load()
  },[])

  async function load(){
    const res = await fetch('/api/adminboard')
    const data = await res.json()
    setApplications(data.applications || [])
    setLoading(false)
  }

  async function accept(id:string){
    const date = prompt("Datum (YYYY-MM-DD)")
    const time = prompt("Uhrzeit (HH:MM)")
    const place = prompt("Wo findet das Gespräch statt?")

    if(!date || !time || !place) return

    await fetch('/api/adminboard/accept',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id,
        date:`${date}T${time}`,
        place
      })
    })

    load()
  }

  async function reject(id:string){
    const reason = prompt("Optionaler Grund für Ablehnung")

    await fetch('/api/adminboard/reject',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id,
        reason
      })
    })

    load()
  }

  async function remove(id:string){
    if(!confirm("Bewerbung wirklich löschen?")) return

    await fetch('/api/adminboard/delete',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id})
    })

    load()
  }

  if(loading){
    return(
      <div className="h-screen flex justify-center items-center text-white text-2xl">
        Lade Bewerbungen…
      </div>
    )
  }

  return(
    <motion.div
      initial={{opacity:0,scale:0.95}}
      animate={{opacity:1,scale:1}}
      className="min-h-screen bg-gray-900 text-white p-10"
    >

      <h1 className="text-4xl font-bold mb-10 text-center">
        Admin Dashboard – Bewerbungen
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {applications.map(app=>(
          <motion.div
            key={app.id}
            layout
            whileHover={{scale:1.03}}
            className="bg-gray-800 rounded-2xl p-6 shadow-xl"
          >

            <div className="flex justify-between mb-3">

              <h2 className="font-bold text-lg">
                {app.name}
              </h2>

              <span className={`text-xs px-2 py-1 rounded ${roleColors[app.role] || 'bg-gray-600'}`}>
                {app.role}
              </span>

            </div>

            <p className="text-sm text-gray-400 mb-1">
              Alter: {app.age}
            </p>

            <p className="text-sm text-gray-400 mb-4">
              {app.email}
            </p>

            <button
              onClick={()=>setExpanded(expanded===app.id ? null : app.id)}
              className="text-purple-400 text-sm mb-4"
            >
              Antworten anzeigen
            </button>

            <AnimatePresence>

              {expanded===app.id && (
                <motion.div
                  initial={{opacity:0,height:0}}
                  animate={{opacity:1,height:'auto'}}
                  exit={{opacity:0,height:0}}
                  className="space-y-2 mb-4"
                >
                  {Object.entries(app.answers).map(([q,a])=>(
                    <div key={q}>
                      <p className="text-gray-400 text-xs">{q}</p>
                      <p className="text-sm">{a}</p>
                    </div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>

            <div className="flex gap-2">

              <button
                onClick={()=>accept(app.id)}
                className="bg-green-600 px-3 py-2 rounded"
              >
                Annehmen
              </button>

              <button
                onClick={()=>reject(app.id)}
                className="bg-yellow-600 px-3 py-2 rounded"
              >
                Ablehnen
              </button>

              <button
                onClick={()=>remove(app.id)}
                className="bg-red-600 px-3 py-2 rounded"
              >
                Löschen
              </button>

            </div>

          </motion.div>
        ))}

      </div>

    </motion.div>
  )
}
