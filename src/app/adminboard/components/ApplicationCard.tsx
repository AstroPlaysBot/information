'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function ApplicationCard({ app, reload }: any) {

  const router = useRouter()

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

  return (

    <motion.div
    whileHover={{scale:1.03}}
    className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 shadow-xl">

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

      <button
      onClick={()=>router.push(`/adminboard/applicant/${app.id}`)}
      className="text-purple-400 text-sm mt-4 hover:underline">

        Bewerber einsehen

      </button>

    </motion.div>

  )

}
