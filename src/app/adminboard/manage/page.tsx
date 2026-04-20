// src/app/adminboard/manage/page.tsx
'use client'

import { useEffect, useState } from "react"
import { ROLES } from "./config"

const CRYPTIX_ID = "1462891063202156807"

export default function ManagePage() {
  const [users, setUsers] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function loadSession() {
    const res = await fetch("/api/check-auth")
    const data = await res.json()
    setSession(data)
  }

  async function loadUsers() {
    const res = await fetch("/api/adminboard/members")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadSession()
    loadUsers()
  }, [])

  const canAccess = session?.discordId === CRYPTIX_ID

  async function changeRole(discordId: string, role: string) {
    await fetch("/api/adminboard/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordId, role })
    })

    loadUsers()
  }

  if (!canAccess) {
    return (
      <div className="p-10 text-red-400">
        Kein Zugriff.
      </div>
    )
  }

  if (loading) {
    return <div className="p-10 text-gray-400">Lade User...</div>
  }

  return (
    <div className="p-10 space-y-5 text-white">

      <h1 className="text-2xl font-bold">User Verwaltung</h1>

      <div className="space-y-3">

        {users.map((u) => (
          <div
            key={u.discordId}
            className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center"
          >

            <div>
              <p className="font-semibold">{u.name || u.discordId}</p>
              <p className="text-xs text-gray-500">{u.discordId}</p>
            </div>

            <select
              value={u.role}
              onChange={(e) => changeRole(u.discordId, e.target.value)}
              className="bg-gray-800 p-2 rounded-lg text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

          </div>
        ))}

      </div>
    </div>
  )
}
