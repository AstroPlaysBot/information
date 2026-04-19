'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function ApplicationCard({ app, reload }: any) {

  const router = useRouter()
  const status = app.status || "PENDING"

  const avatar =
    app.avatar?.startsWith("http")
      ? app.avatar
      : app.avatar
        ? `https://cdn.discordapp.com/avatars/${app.discord_id}/${app.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`

  function statusBadge() {

    if (status === "INTERVIEW")
      return <span className="text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-full">
        Eingeladen
      </span>

    if (status === "HIRED")
      return <span className="text-xs bg-green-600/20 text-green-300 border border-green-500/30 px-2 py-1 rounded-full">
        Angenommen
      </span>

    if (status === "REJECTED")
      return <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-1 rounded-full">
        Abgelehnt
      </span>

    return <span className="text-xs bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 px-2 py-1 rounded-full">
      Neu
    </span>
  }

  return (

    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800/60 rounded-2xl p-5 shadow-xl hover:shadow-purple-500/10 transition-all"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          {/* AVATAR */}
          <img
            src={avatar}
            alt="avatar"
            className="w-11 h-11 rounded-full border border-gray-700 object-cover"
          />

          <div>

            <h2 className="text-md font-semibold text-white leading-tight">
              {app.name}
            </h2>

            <p className="text-xs text-gray-400">
              Bewerbung für <span className="text-purple-400">{app.role}</span>
            </p>

          </div>

        </div>

        {statusBadge()}

      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between">

        <button
          onClick={() => router.push(`/adminboard/applicant/${app.id}`)}
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          Bewerber öffnen →
        </button>

      </div>

    </motion.div>

  )
}
