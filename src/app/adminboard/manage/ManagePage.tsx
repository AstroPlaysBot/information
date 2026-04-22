'use client'
import { useEffect, useState } from "react"

const CRYPTIX_ID = "1462891063202156807"

const CATEGORIES = [
  { label: "Gründer", positions: ["Gründer"], managerTitle: null },
  { label: "Moderator", positions: ["Moderator"], managerTitle: "Senior Moderator" },
  { label: "Beta Tester", positions: ["Beta Tester"], managerTitle: null },
  { label: "Frontend Developer", positions: ["Frontend Developer", "Junior Frontend Developer"], managerTitle: "Lead Frontend Developer" },
  { label: "Backend Developer", positions: ["Backend Developer", "Junior Backend Developer"], managerTitle: "Lead Backend Developer" },
  { label: "Promotion Manager", positions: ["Promotion Manager", "Junior Promotion Manager"], managerTitle: "Senior Promotion Manager" },
  { label: "Praktikant", positions: ["Praktikant"], managerTitle: null },
]

const GAME_NAMES = [
  "Minecraft",
  "Fortnite",
  "GTA V",
  "League of Legends",
  "Valorant",
  "Rocket League",
  "Apex Legends",
  "Destiny 2",
]

const DEFAULT_AVAIL = {
  premium: true,
  games: Object.fromEntries(GAME_NAMES.map((g) => [g, true])),
}

// ── Storage helpers ────────────────────────────────────────────────────────
async function loadAvail() {
  try {
    const res = await fetch("/api/adminboard/availability", {
      credentials: "include"
    })

    const data = await res.json()

    return {
      premium: data.premium ?? true,
      games: { ...DEFAULT_AVAIL.games, ...data.games }
    }
  } catch {
    return DEFAULT_AVAIL
  }
}

async function saveAvail(data: typeof DEFAULT_AVAIL) {
  try {
    await fetch("/api/adminboard/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    return true
  } catch {
    return false
  }
}

// ── Toggle sub-component (used only inside Kaufeinstellungen) ──────────────
function AvailToggle({
  value,
  onChange,
  label,
  sublabel,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
  sublabel?: string
}) {
  return (
    <div
      className="flex items-center justify-between py-3.5 px-5 rounded-xl border transition-all duration-200 cursor-pointer select-none"
      style={{
        background: value ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)",
        borderColor: value ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.07)",
      }}
      onClick={() => onChange(!value)}
    >
      <div>
        <p className={`font-semibold text-sm ${value ? "text-white" : "text-gray-500"}`}>{label}</p>
        {sublabel && <p className="text-gray-700 text-xs mt-0.5">{sublabel}</p>}
      </div>
      <div
        className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ml-4"
        style={{
          background: value
            ? "linear-gradient(135deg,#6366f1,#a855f7)"
            : "rgba(255,255,255,0.09)",
        }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
          style={{ left: value ? "calc(100% - 20px)" : "4px" }}
        />
      </div>
    </div>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────
interface Toast {
  id: number
  type: "success" | "error"
  message: string
}
interface ManagePageProps {
  onTabChange?: (tab: string) => void
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ManagePage({ onTabChange }: ManagePageProps) {
  const [users, setUsers] = useState<any[]>([])
  const [myRole, setMyRole] = useState<string | null>(null)
  const [myDiscordId, setMyDiscordId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [pendingSelections, setPendingSelections] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"berechtigungen" | "zentrale" | "kaufeinstellungen">("berechtigungen")

  const [zentraleUsers, setZentraleUsers] = useState<any[]>([])
  const [zentraleLoading, setZentraleLoading] = useState(false)
  const [zentraleSaving, setZentraleSaving] = useState<string | null>(null)

  // Kaufeinstellungen state
  const [avail, setAvail] = useState(DEFAULT_AVAIL)
  const [availLoaded, setAvailLoaded] = useState(false)
  const [availSaving, setAvailSaving] = useState(false)
  const [availSaved, setAvailSaved] = useState(false)

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setMyRole(d.role)
        setMyDiscordId(d.discordId)
      })
      .catch(() => {})
    loadUsers()
  }, [])

  useEffect(() => {
    if (activeTab === "zentrale") loadZentraleUsers()
    if (activeTab === "kaufeinstellungen" && !availLoaded) {
      loadAvail().then((d) => { setAvail(d); setAvailLoaded(true) })
    }
    onTabChange?.(activeTab)
  }, [activeTab])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest("[data-dropdown]")) setOpenDropdown(null)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function loadUsers() {
    setLoading(true)
    const res = await fetch("/api/adminboard/members")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  async function loadZentraleUsers() {
    setZentraleLoading(true)
    try {
      const res = await fetch("/api/adminboard/zentrale-access", { credentials: "include" })
      const data = await res.json()
      setZentraleUsers(Array.isArray(data) ? data : [])
    } catch {}
    setZentraleLoading(false)
  }

  async function toggleZentraleAccess(discordId: string, discordName: string, current: boolean) {
    if (myDiscordId !== CRYPTIX_ID) return
    setZentraleSaving(discordId)
    try {
      await fetch("/api/adminboard/zentrale-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ discordId, discordName, canAccess: !current }),
      })
      setZentraleUsers((prev) =>
        prev.map((u) => (u.discordId === discordId ? { ...u, canAccess: !current } : u))
      )
      addToast("success", `Zugriff ${!current ? "gewährt" : "entzogen"}.`)
    } catch {
      addToast("error", "Fehler beim Speichern.")
    }
    setZentraleSaving(null)
  }

  function addToast(type: "success" | "error", message: string) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000)
  }
  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const isCryptix = myDiscordId === CRYPTIX_ID
  const canSeeManage = myRole !== null

  function getCategoryForUser(user: any) {
    return (
      CATEGORIES.find((cat) =>
        cat.positions.some((p) => user.position?.toLowerCase().includes(p.toLowerCase()))
      ) || CATEGORIES[CATEGORIES.length - 1]
    )
  }

  function getDisplayTitle(user: any, cat: (typeof CATEGORIES)[0]): string {
    if (user.role === "PERSONAL_MANAGER" && cat.managerTitle) return cat.managerTitle
    return "Viewer"
  }

  function selectOption(discordId: string, value: string) {
    setPendingSelections((prev) => ({ ...prev, [discordId]: value }))
  }
  function cancelSelection(discordId: string) {
    setPendingSelections((prev) => {
      const next = { ...prev }
      delete next[discordId]
      return next
    })
    setOpenDropdown(null)
  }

  async function saveRole(user: any) {
    if (!isCryptix) return
    const selectedRole = pendingSelections[user.discordId]
    if (!selectedRole || selectedRole === user.role) { cancelSelection(user.discordId); return }

    if (selectedRole === "PERSONAL_MANAGER") {
      const cat = getCategoryForUser(user)
      const conflict = users.find(
        (u) =>
          u.discordId !== user.discordId &&
          u.role === "PERSONAL_MANAGER" &&
          getCategoryForUser(u).label === cat.label
      )
      if (conflict) {
        addToast("error", `Es gibt bereits einen ${cat.managerTitle}: ${conflict.discordName}. Setze diesen zuerst auf Viewer.`)
        cancelSelection(user.discordId)
        return
      }
    }

    setSaving(user.discordId)
    try {
      const res = await fetch("/api/adminboard/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: user.discordId, role: selectedRole }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setUsers((prev) =>
        prev.map((u) => (u.discordId === user.discordId ? { ...u, role: selectedRole } : u))
      )
      addToast("success", "Rolle erfolgreich gespeichert.")
    } catch {
      addToast("error", "Fehler beim Speichern. Bitte versuche es erneut.")
    }
    cancelSelection(user.discordId)
    setSaving(null)
  }

  // Kaufeinstellungen helpers
  const setPremium = (v: boolean) => setAvail((a) => ({ ...a, premium: v }))
  const setGame = (name: string, v: boolean) =>
    setAvail((a) => ({ ...a, games: { ...a.games, [name]: v } }))
  const allGamesOn = GAME_NAMES.every((g) => avail.games[g] !== false)
  const toggleAll = () =>
    setAvail((a) => ({
      ...a,
      games: Object.fromEntries(GAME_NAMES.map((g) => [g, !allGamesOn])),
    }))

  async function handleAvailSave() {
    setAvailSaving(true)
    const ok = await saveAvail(avail)
    setAvailSaving(false)
    if (ok) {
      setAvailSaved(true)
      addToast("success", "Kaufeinstellungen gespeichert.")
      setTimeout(() => setAvailSaved(false), 2500)
    } else {
      addToast("error", "Fehler beim Speichern.")
    }
  }

  if (!canSeeManage && myRole !== null) {
    return <div className="p-10 text-red-400">Kein Zugriff.</div>
  }
  if (loading || myRole === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const TABS = [
    { key: "berechtigungen", label: "Berechtigungen", locked: false },
    { key: "zentrale",       label: "Zentrale",        locked: false },
    { key: "kaufeinstellungen", label: "Kaufeinstellungen", locked: !isCryptix },
  ] as const

  return (
    <div className="min-h-screen bg-gray-950 text-white px-10 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Verwalten</h1>
        {!isCryptix && (
          <span className="text-xs text-gray-600 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
            🔒 Nur Ansicht
          </span>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (!tab.locked) setActiveTab(tab.key)
              }}
              title={tab.locked ? "Kein Zugriff" : undefined}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                tab.locked
                  ? "text-gray-700 cursor-not-allowed"
                  : isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.locked && (
                <svg
                  className="w-3 h-3 text-gray-700 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── BERECHTIGUNGEN ── */}
      {activeTab === "berechtigungen" && (
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const catUsers = users.filter((u) =>
              cat.positions.some((p) => u.position?.toLowerCase().includes(p.toLowerCase()))
            )
            const isFounder = cat.label === "Gründer"
            const displayUsers = isFounder
              ? [
                  { discordId: CRYPTIX_ID, discordName: "Cryptix", position: "Gründer", role: "OWNER" },
                  ...catUsers.filter((u) => u.discordId !== CRYPTIX_ID),
                ]
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
                  displayUsers.map((user) => {
                    const isFounderUser = user.discordId === CRYPTIX_ID
                    const displayTitle = getDisplayTitle(user, cat)
                    const isOpen = openDropdown === user.discordId
                    const pendingValue = pendingSelections[user.discordId]
                    const hasPending = pendingValue !== undefined && pendingValue !== user.role
                    const isSavingThis = saving === user.discordId

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
                            <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-full">
                              Gründer
                            </span>
                          ) : isCryptix ? (
                            <div className="relative" data-dropdown>
                              <button
                                onClick={() => {
                                  if (isOpen) {
                                    setOpenDropdown(null)
                                    cancelSelection(user.discordId)
                                  } else {
                                    setOpenDropdown(user.discordId)
                                    setPendingSelections((prev) => ({ ...prev, [user.discordId]: user.role }))
                                  }
                                }}
                                disabled={isSavingThis}
                                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition ${
                                  user.role === "PERSONAL_MANAGER"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                                    : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
                                } disabled:opacity-40`}
                              >
                                {isSavingThis && (
                                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                )}
                                {displayTitle}
                                <span className="text-gray-600">▾</span>
                              </button>
                              {isOpen && (
                                <div className="absolute right-0 top-10 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
                                  <div className="px-3 py-2 border-b border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Rolle wählen</p>
                                  </div>
                                  <button
                                    onClick={() => selectOption(user.discordId, "VIEWER")}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center justify-between ${
                                      (pendingValue ?? user.role) === "VIEWER"
                                        ? "bg-gray-700 text-white"
                                        : "hover:bg-gray-700 text-gray-300"
                                    }`}
                                  >
                                    Viewer
                                    {(pendingValue ?? user.role) === "VIEWER" && (
                                      <span className="text-green-400 text-xs">✓</span>
                                    )}
                                  </button>
                                  {cat.managerTitle && (
                                    <button
                                      onClick={() => selectOption(user.discordId, "PERSONAL_MANAGER")}
                                      className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center justify-between ${
                                        (pendingValue ?? user.role) === "PERSONAL_MANAGER"
                                          ? "bg-gray-700 text-white"
                                          : "hover:bg-gray-700 text-gray-300"
                                      }`}
                                    >
                                      {cat.managerTitle}
                                      {(pendingValue ?? user.role) === "PERSONAL_MANAGER" && (
                                        <span className="text-green-400 text-xs">✓</span>
                                      )}
                                    </button>
                                  )}
                                  {!cat.managerTitle && (
                                    <div className="px-4 py-2.5 text-xs text-gray-600 italic">Keine weiteren Optionen</div>
                                  )}
                                  <div className="flex gap-2 px-3 py-3 border-t border-gray-700">
                                    <button
                                      onClick={() => cancelSelection(user.discordId)}
                                      className="flex-1 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                                    >
                                      Abbrechen
                                    </button>
                                    <button
                                      onClick={() => saveRole(user)}
                                      disabled={!hasPending}
                                      className="flex-1 py-1.5 text-xs bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition text-white font-medium"
                                    >
                                      Speichern
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full border ${
                                user.role === "PERSONAL_MANAGER"
                                  ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                  : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                              }`}
                            >
                              {displayTitle}
                            </span>
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
      )}

      {/* ── ZENTRALE ── */}
      {activeTab === "zentrale" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">Personen die Zugriff auf die Zentrale haben</p>
          {zentraleLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : zentraleUsers.length === 0 ? (
            <p className="text-xs text-gray-600 italic">Keine Teammitglieder gefunden.</p>
          ) : (
            zentraleUsers.map((user) => (
              <div
                key={user.discordId}
                className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-sm">{user.discordName}</p>
                  <p className="text-xs text-gray-500">{user.position}</p>
                </div>
                <div className="flex items-center gap-3">
                  {isCryptix ? (
                    <button
                      onClick={() => toggleZentraleAccess(user.discordId, user.discordName, user.canAccess)}
                      disabled={zentraleSaving === user.discordId}
                      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition ${
                        user.canAccess
                          ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                          : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
                      } disabled:opacity-40`}
                    >
                      {zentraleSaving === user.discordId && (
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      )}
                      {user.canAccess ? "Zugriff aktiv" : "Kein Zugriff"}
                    </button>
                  ) : (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        user.canAccess
                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                          : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {user.canAccess ? "Zugriff aktiv" : "Kein Zugriff"}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── KAUFEINSTELLUNGEN (Cryptix only) ── */}
      {activeTab === "kaufeinstellungen" && isCryptix && (
        <div className="space-y-6 max-w-lg">
          <p className="text-xs text-gray-500">
            Aktiviere oder deaktiviere Premium und einzelne Spiele auf der Kaufseite.
          </p>

          {/* Premium */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Premium</p>
            <AvailToggle
              value={avail.premium}
              onChange={setPremium}
              label="AstroPlays Premium"
              sublabel='Deaktiviert: "Aktuell nicht verfügbar" auf der Kaufseite'
            />
          </div>

          {/* Games */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Spielothek</p>
              <button
                onClick={toggleAll}
                className="text-xs text-gray-600 hover:text-gray-400 border border-gray-800 hover:border-gray-700 px-3 py-1 rounded-lg transition"
              >
                {allGamesOn ? "Alle deaktivieren" : "Alle aktivieren"}
              </button>
            </div>
            {GAME_NAMES.map((name) => (
              <AvailToggle
                key={name}
                value={avail.games[name] !== false}
                onChange={(v) => setGame(name, v)}
                label={name}
              />
            ))}
          </div>

          {/* Save */}
          <button
            onClick={handleAvailSave}
            disabled={availSaving}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: availSaved
                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                : "linear-gradient(135deg,#6366f1,#a855f7)",
              boxShadow: availSaved
                ? "0 0 24px rgba(34,197,94,0.2)"
                : "0 0 24px rgba(99,102,241,0.18)",
              cursor: availSaving ? "wait" : "pointer",
            }}
          >
            {availSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Speichern…
              </>
            ) : availSaved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Gespeichert!
              </>
            ) : (
              "Änderungen speichern →"
            )}
          </button>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium max-w-sm transition-all ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-50 hover:opacity-100 transition ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
