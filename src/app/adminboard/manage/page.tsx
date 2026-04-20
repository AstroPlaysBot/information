'use client'
import { useEffect, useState } from "react"

const CRYPTIX_ID = "1462891063202156807"

const CATEGORIES = [
  {
    label: "Gründer",
    positions: ["Gründer"],
    managerTitle: null,
  },
  {
    label: "Moderator",
    positions: ["Moderator"],
    managerTitle: "Senior Moderator",
  },
  {
    label: "Beta Tester",
    positions: ["Beta Tester"],
    managerTitle: null,
  },
  {
    label: "Frontend Developer",
    positions: ["Frontend Developer", "Junior Frontend Developer"],
    managerTitle: "Lead Frontend Developer",
  },
  {
    label: "Backend Developer",
    positions: ["Backend Developer", "Junior Backend Developer"],
    managerTitle: "Lead Backend Developer",
  },
  {
    label: "Promotion Manager",
    positions: ["Promotion Manager", "Junior Promotion Manager"],
    managerTitle: "Senior Promotion Manager",
  },
  {
    label: "Praktikant",
    positions: ["Praktikant"],
    managerTitle: null,
  },
]

const TITLE_TO_DB_ROLE: Record<string, string> = {
  "Senior Moderator": "PERSONAL_MANAGER",
  "Lead Frontend Developer": "PERSONAL_MANAGER",
  "Lead Backend Developer": "PERSONAL_MANAGER",
  "Senior Promotion Manager": "PERSONAL_MANAGER",
}

export default function ManagePage() {
  const [users, setUsers] = useState<any[]>([])
  const [myRole, setMyRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Pro User: welche Auswahl gerade aktiv ist (null = kein Edit-Modus)
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then(r => r.json())
      .then(d => setMyRole(d.role))
      .catch(() => {})
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const res = await fetch("/api/adminboard/members")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  const canAccess = myRole === "OWNER"

  function getCategoryForUser(user: any) {
    return CATEGORIES.find(cat =>
      cat.positions.some(p =>
        user.position?.toLowerCase().includes(p.toLowerCase())
      )
    ) || CATEGORIES[CATEGORIES.length - 1]
  }

  // Zeigt den lesbaren Titel basierend auf DB-Role + Kategorie
  function getDisplayTitle(user: any, cat: typeof CATEGORIES[0]): string {
    if (user.role === "PERSONAL_MANAGER" && cat.managerTitle) return cat.managerTitle
    return "Viewer"
  }

  function startEdit(user: any) {
    setPendingRoles(prev => ({ ...prev, [user.discordId]: user.role }))
  }

  function cancelEdit(discordId: string) {
    setPendingRoles(prev => {
      const next = { ...prev }
      delete next[discordId]
      return next
    })
  }

  function selectPending(discordId: string, value: string) {
    setPendingRoles(prev => ({ ...prev, [discordId]: value }))
  }

  async function saveRole(user: any) {
    setErrorMsg(null)
    const selectedRole = pendingRoles[user.discordId]
    if (!selectedRole) return

    if (selectedRole === "PERSONAL_MANAGER") {
      const cat = getCategoryForUser(user)
      const conflict = users.find(u =>
        u.discordId !== user.discordId &&
        u.role === "PERSONAL_MANAGER" &&
        getCategoryForUser(u).label === cat.label
      )
      if (conflict) {
        setErrorMsg(`Es gibt bereits einen ${cat.managerTitle}: ${conflict.discordName}. Setze diesen zuerst auf Viewer.`)
        cancelEdit(user.discordId)
        return
      }
    }

    await fetch("/api/adminboard/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordId: user.discordId, role: selectedRole })
    })
    cancelEdit(user.discordId)
    loadUsers()
  }

  if (!canAccess && myRole !== null) {
    return <div className="p-10 text-red-400">Kein Zugriff.</div>
  }

  if (loading || myRole === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-10 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Verwalten</h1>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {errorMsg}
          <button onClick={() => setErrorMsg(null)} className="ml-3 text-red-300 hover:text-white">✕</button>
        </div>
      )}

      {CATEGORIES.map(cat => {
        const catUsers = users.filter(u =>
          cat.positions.some(p =>
            u.position?.toLowerCase().includes(p.toLowerCase())
          )
        )

        const isFounder = cat.label === "Gründer"
        const displayUsers = isFounder
          ? [{ discordId: CRYPTIX_ID, discordName: "Cryptix", position: "Gründer", role: "OWNER" }, ...catUsers.filter(u => u.discordId !== CRYPTIX_ID)]
          : [...catUsers].sort((a, b) => {
              if (a.role === "PERSONAL_MANAGER" && b.role !== "PERSONAL_MANAGER") return -1
              if (b.role === "PERSONAL_MANAGER" && a.role !== "PERSONAL_MANAGER") return 1
              return 0
            })

        return (
          <div key={cat.label} className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">{cat.label}</p>

            {displayUsers.length === 0 ? (
              <p className="text-xs text-gray-600 italic px-1">Aktuell arbeitet niemand in diesem Bereich.</p>
            ) : (
              displayUsers.map(user => {
                const isFounderUser = user.discordId === CRYPTIX_ID
                const displayTitle = getDisplayTitle(user, cat)
                const isEditing = user.discordId in pendingRoles
                const pendingValue = pendingRoles[user.discordId]
                const hasChanged = isEditing && pendingValue !== user.role

                return (
                  <div
                    key={user.discordId}
                    className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-sm">{user.discordName || user.discordId}</p>
                      <p className="text-xs text-gray-500">{user.position}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {isFounderUser ? (
                        <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-full">
                          Gründer
                        </span>
                      ) : isEditing ? (
                        // Edit-Modus
                        <div className="flex items-center gap-2">
                          {/* Viewer Option */}
                          <button
                            onClick={() => selectPending(user.discordId, "VIEWER")}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                              pendingValue === "VIEWER"
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                            }`}
                          >
                            Viewer
                          </button>

                          {/* Manager Option (nur wenn Kategorie einen managerTitle hat) */}
                          {cat.managerTitle && (
                            <button
                              onClick={() => selectPending(user.discordId, "PERSONAL_MANAGER")}
                              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                pendingValue === "PERSONAL_MANAGER"
                                  ? "bg-blue-600 border-blue-500 text-white"
                                  : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                              }`}
                            >
                              {cat.managerTitle}
                            </button>
                          )}

                          {/* Speichern */}
                          {hasChanged && (
                            <button
                              onClick={() => saveRole(user)}
                              className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg border border-green-500 text-white transition font-medium"
                            >
                              Speichern
                            </button>
                          )}

                          {/* Abbrechen */}
                          <button
                            onClick={() => cancelEdit(user.discordId)}
                            className="text-xs text-gray-600 hover:text-gray-300 transition px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        // Anzeige-Modus
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full border ${
                            user.role === "PERSONAL_MANAGER"
                              ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                              : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                          }`}>
                            {displayTitle}
                          </span>
                          <button
                            onClick={() => startEdit(user)}
                            className="text-xs text-gray-600 hover:text-gray-300 transition px-2 py-1 rounded-lg hover:bg-gray-800"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )
      })}
    </div>
  )
}
