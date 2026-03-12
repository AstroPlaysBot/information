'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, LogOut } from 'lucide-react'

interface Application {
  id: string
  role: string
  name: string
  age: string
  email: string
  answers: Record<string,string>
  submittedAt: string
}

const roleColors:Record<string,string> = {
  'Beta Tester':'bg-purple-600',
  'Moderator':'bg-indigo-600',
  'Frontend Developer':'bg-green-600',
  'Backend Developer':'bg-red-600',
  'Praktikant':'bg-yellow-500',
  'Promotion Manager':'bg-pink-600'
}

export default function AdminBoardClient(){

  const [applications,setApplications] = useState<Application[]>([])
  const [expanded,setExpanded] = useState<string|null>(null)
  const [loading,setLoading] = useState(true)
  const [logoutAnim,setLogoutAnim] = useState(false)

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
    const confirmReject = confirm("Bewerbung wirklich ablehnen?")
    if(!confirmReject) return

    const reason = prompt("Optionaler Grund")

    await fetch('/api/adminboard/reject',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id,reason})
    })

    load()
  }

  async function remove(id:string){
    const confirmDelete = confirm("Bewerbung in Papierkorb verschieben?")
    if(!confirmDelete) return

    await fetch('/api/adminboard/delete',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id})
    })

    load()
  }

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Lade Bewerbungen...
      </div>
    )
  }

  return(

  <AnimatePresence>
  {!logoutAnim && (

  <motion.div
    initial={{opacity:0, y:-50}}
    animate={{opacity:1, y:0}}
    exit={{opacity:0, y:50}}
    transition={{duration:0.6}}
    className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-10"
  >

  {/* Papierkorb Button */}
  <button
    onClick={()=>location.href="/delete"}
    className="fixed top-6 left-6 bg-red-600 hover:bg-red-700 p-3 rounded-xl shadow-lg transition"
  >
    <Trash2 size={20}/>
  </button>

  {/* Logout */}
  <button
    onClick={()=>{
      setLogoutAnim(true)
      setTimeout(()=>location.href="/",600) // nach Animation redirect
    }}
    className="fixed top-6 right-6 bg-gray-700 hover:bg-gray-600 p-3 rounded-xl shadow-lg"
  >
    <LogOut size={20}/>
  </button>

  {/* Title */}
  <div className="text-center mb-14">
    <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
      Bewerbungs Dashboard
    </h1>
    <p className="text-gray-400">
      Verwalte eingegangene Bewerbungen
    </p>
  </div>

  {/* Grid */}
  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
    {applications.map(app=>(
      <motion.div
        key={app.id}
        layout
        whileHover={{scale:1.04}}
        className="bg-gray-800/70 backdrop-blur rounded-2xl p-6 border border-gray-700 shadow-xl"
      >

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{app.name}</h2>
        <span className={`text-xs px-3 py-1 rounded-full ${roleColors[app.role] || 'bg-gray-600'}`}>
          {app.role}
        </span>
      </div>

      <p className="text-sm text-gray-400">Alter: {app.age}</p>
      <p className="text-sm text-gray-400 mb-4">{app.email}</p>

      {/* Antworten */}
      <button
        onClick={()=>setExpanded(expanded===app.id ? null : app.id)}
        className="text-purple-400 text-sm hover:underline mb-4"
      >
        Antworten anzeigen
      </button>

      <AnimatePresence>
      {expanded===app.id &&(
        <motion.div
          initial={{opacity:0,height:0}}
          animate={{opacity:1,height:'auto'}}
          exit={{opacity:0,height:0}}
          className="space-y-3 mb-5 border-t border-gray-700 pt-3"
        >
        {Object.entries(app.answers).map(([q,a])=>(
          <div key={q}>
            <p className="text-xs text-gray-500">{q}</p>
            <p className="text-sm">{a}</p>
          </div>
        ))}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={()=>accept(app.id)}
          className="flex-1 bg-green-600 hover:bg-green-700 transition px-3 py-2 rounded-lg text-sm"
        >Annehmen</button>

        <button
          onClick={()=>reject(app.id)}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 transition px-3 py-2 rounded-lg text-sm"
        >Ablehnen</button>

        <button
          onClick={()=>remove(app.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 transition px-3 py-2 rounded-lg text-sm"
        >Löschen</button>
      </div>

      </motion.div>
    ))}
  </div>

  </motion.div>
  )}
  </AnimatePresence>
  )
}
