'use client'
import { useEffect, useState } from "react"

const CRYPTIX_ID = "1462891063202156807"

const CATEGORIES = [
  { label: "Gründer",             positions: ["Gründer"],                                      managerTitle: null },
  { label: "Moderator",           positions: ["Moderator"],                                    managerTitle: "Senior Moderator" },
  { label: "Beta Tester",         positions: ["Beta Tester"],                                  managerTitle: null },
  { label: "Frontend Developer",  positions: ["Frontend Developer", "Junior Frontend Developer"], managerTitle: "Lead Frontend Developer" },
  { label: "Backend Developer",   positions: ["Backend Developer",  "Junior Backend Developer"],  managerTitle: "Lead Backend Developer" },
  { label: "Promotion Manager",   positions: ["Promotion Manager",  "Junior Promotion Manager"],  managerTitle: "Senior Promotion Manager" },
  { label: "Praktikant",          positions: ["Praktikant"],                                   managerTitle: null },
]

const GAME_NAMES = [
  "Minecraft", "Fortnite", "GTA V", "League of Legends",
  "Valorant", "Rocket League", "Apex Legends", "Destiny 2",
]

// ── Typen ──────────────────────────────────────────────────────────────────
type DiscountsState = {
  premium?: number
  games?: Record<string, number>
}

type AvailState = {
  premium: boolean
  games: Record<string, boolean>
  discounts: DiscountsState
}

const DEFAULT_AVAIL: AvailState = {
  premium: true,
  games: Object.fromEntries(GAME_NAMES.map((g) => [g, true])),
  discounts: {},
}

// ── API helpers ────────────────────────────────────────────────────────────
async function loadAvail(): Promise<AvailState> {
  try {
    const res = await fetch("/api/adminboard/availability", { credentials: "include" })
    const data = await res.json()
    return {
      premium:   data.premium  ?? true,
      games:     { ...DEFAULT_AVAIL.games, ...(data.games ?? {}) },
      discounts: data.discounts ?? {},
    }
  } catch {
    return DEFAULT_AVAIL
  }
}

async function saveAvail(data: AvailState): Promise<boolean> {
  try {
    await fetch("/api/adminboard/availability", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
    return true
  } catch {
    return false
  }
}

// ── Preis-Hilfsfunktionen (gleiche Logik wie PurchasePage) ─────────────────
function calcDiscountedPrice(originalCents: number, discountPercent: number): number {
  return Math.round(originalCents * (1 - discountPercent / 100)) / 100
}
function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",")
}

// ── AvailToggle ────────────────────────────────────────────────────────────
function AvailToggle({
  value, onChange, label, sublabel,
}: {
  value: boolean; onChange: (v: boolean) => void; label: string; sublabel?: string
}) {
  return (
    <div
      className="flex items-center justify-between py-3.5 px-5 rounded-xl border transition-all duration-200 cursor-pointer select-none"
      style={{
        background:   value ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)",
        borderColor:  value ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.07)",
      }}
      onClick={() => onChange(!value)}
    >
      <div>
        <p className={`font-semibold text-sm ${value ? "text-white" : "text-gray-500"}`}>{label}</p>
        {sublabel && <p className="text-gray-700 text-xs mt-0.5">{sublabel}</p>}
      </div>
      <div
        className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ml-4"
        style={{ background: value ? "linear-gradient(135deg,#6366f1,#a855f7)" : "rgba(255,255,255,0.09)" }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
          style={{ left: value ? "calc(100% - 20px)" : "4px" }}
        />
      </div>
    </div>
  )
}

// ── DiscountInput ──────────────────────────────────────────────────────────
// Einzelne Zeile für eine Rabatt-Eingabe mit Vorschau des neuen Preises
function DiscountInput({
  label,
  originalPrice,
  value,
  onChange,
  onClear,
}: {
  label: string
  originalPrice: string
  value: number | undefined
  onChange: (v: number | undefined) => void
  onClear: () => void
}) {
  const [inputVal, setInputVal] = useState(value !== undefined ? String(value) : "")
  const hasDiscount = value !== undefined && value > 0

  // Neuen Preis berechnen
  const origNum = parseFloat(originalPrice.replace(",", "."))
  const newPrice = hasDiscount
    ? formatPrice(calcDiscountedPrice(Math.round(origNum * 100), value!))
    : null

  function handleChange(raw: string) {
    setInputVal(raw)
    const num = parseInt(raw, 10)
    if (!raw || isNaN(num)) {
      onChange(undefined)
    } else {
      const clamped = Math.min(99, Math.max(1, num))
      onChange(clamped)
      if (String(clamped) !== raw) setInputVal(String(clamped))
    }
  }

  // Sync wenn externer Wert sich ändert (z.B. Reset)
  useEffect(() => {
    setInputVal(value !== undefined ? String(value) : "")
  }, [value])

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 rounded-xl border transition-all duration-200"
      style={{
        background:  hasDiscount ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
        borderColor: hasDiscount ? "rgba(239,68,68,0.22)" : "rgba(255,255,255,0.07)",
      }}
    >
      {/* Label + Preisvorschau */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white truncate">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {hasDiscount ? (
            <>
              <span className="text-red-400/60 text-xs line-through">{originalPrice}€</span>
              <span className="text-xs text-white font-bold">{newPrice}€</span>
              <span className="text-[10px] bg-red-600/80 text-white px-1.5 py-0.5 rounded-full font-bold">
                -{value}%
              </span>
            </>
          ) : (
            <span className="text-gray-600 text-xs">{originalPrice}€ · kein Rabatt</span>
          )}
        </div>
      </div>

      {/* Eingabefeld */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative">
          <input
            type="number"
            min={1}
            max={99}
            value={inputVal}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="—"
            className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white text-center
                       focus:outline-none focus:border-red-500/50 focus:bg-gray-700 transition
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none">%</span>
        </div>
        {hasDiscount && (
          <button
            onClick={onClear}
            title="Rabatt entfernen"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20
                       text-red-400 hover:bg-red-500/20 transition text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

// ── Toast / Interface-Typen ────────────────────────────────────────────────
interface Toast { id: number; type: "success" | "error"; message: string }
interface ManagePageProps { onTabChange?: (tab: string) => void }

// ── Haupt-Komponente ───────────────────────────────────────────────────────
export default function ManagePage({ onTabChange }: ManagePageProps) {
  const [users,          setUsers]          = useState<any[]>([])
  const [myRole,         setMyRole]         = useState<string | null>(null)
  const [myDiscordId,    setMyDiscordId]    = useState<string | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [toasts,         setToasts]         = useState<Toast[]>([])
  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null)
  const [pendingSelections, setPendingSelections] = useState<Record<string, string>>({})
  const [saving,         setSaving]         = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"berechtigungen" | "zentrale" | "kaufeinstellungen">("berechtigungen")

  const [zentraleUsers,   setZentraleUsers]   = useState<any[]>([])
  const [zentraleLoading, setZentraleLoading] = useState(false)
  const [zentraleSaving,  setZentraleSaving]  = useState<string | null>(null)

  // Kaufeinstellungen
  const [avail,       setAvail]       = useState<AvailState>(DEFAULT_AVAIL)
  const [availLoaded, setAvailLoaded] = useState(false)
  const [availSaving, setAvailSaving] = useState(false)
  const [availSaved,  setAvailSaved]  = useState(false)

  // ── Initialisierung ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setMyRole(d.role); setMyDiscordId(d.discordId) })
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
      if (!(e.target as HTMLElement).closest("[data-dropdown]")) setOpenDropdown(null)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // ── Daten laden ──────────────────────────────────────────────────────────
  async function loadUsers() {
    setLoading(true)
    const res  = await fetch("/api/adminboard/members")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  async function loadZentraleUsers() {
    setZentraleLoading(true)
    try {
      const res  = await fetch("/api/adminboard/zentrale-access", { credentials: "include" })
      const data = await res.json()
      setZentraleUsers(Array.isArray(data) ? data : [])
    } catch {}
    setZentraleLoading(false)
  }

  // ── Toasts ───────────────────────────────────────────────────────────────
  function addToast(type: "success" | "error", message: string) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000)
  }
  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ── Zentrale Zugriff ─────────────────────────────────────────────────────
  async function toggleZentraleAccess(discordId: string, discordName: string, current: boolean) {
    if (myDiscordId !== CRYPTIX_ID) return
    setZentraleSaving(discordId)
    try {
      await fetch("/api/adminboard/zentrale-access", {
        method:  "POST",
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

  // ── Rollen ───────────────────────────────────────────────────────────────
  const isCryptix   = myDiscordId === CRYPTIX_ID
  const canSeeManage = myRole !== null

  function getCategoryForUser(user: any) {
    return (
      CATEGORIES.find((cat) =>
        cat.positions.some((p) => user.position?.toLowerCase().includes(p.toLowerCase()))
      ) || CATEGORIES[CATEGORIES.length - 1]
    )
  }
  function getDisplayTitle(user: any, cat: (typeof CATEGORIES)[0]) {
    if (user.role === "PERSONAL_MANAGER" && cat.managerTitle) return cat.managerTitle
    return "Viewer"
  }
  function selectOption(discordId: string, value: string) {
    setPendingSelections((prev) => ({ ...prev, [discordId]: value }))
  }
  function cancelSelection(discordId: string) {
    setPendingSelections((prev) => { const n = { ...prev }; delete n[discordId]; return n })
    setOpenDropdown(null)
  }
  async function saveRole(user: any) {
    if (!isCryptix) return
    const selectedRole = pendingSelections[user.discordId]
    if (!selectedRole || selectedRole === user.role) { cancelSelection(user.discordId); return }

    if (selectedRole === "PERSONAL_MANAGER") {
      const cat      = getCategoryForUser(user)
      const conflict = users.find(
        (u) => u.discordId !== user.discordId && u.role === "PERSONAL_MANAGER" &&
               getCategoryForUser(u).label === cat.label
      )
      if (conflict) {
        addToast("error", `Es gibt bereits einen ${cat.managerTitle}: ${conflict.discordName}.`)
        cancelSelection(user.discordId)
        return
      }
    }
    setSaving(user.discordId)
    try {
      const res  = await fetch("/api/adminboard/set-role", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: user.discordId, role: selectedRole }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setUsers((prev) => prev.map((u) => u.discordId === user.discordId ? { ...u, role: selectedRole } : u))
      addToast("success", "Rolle erfolgreich gespeichert.")
    } catch {
      addToast("error", "Fehler beim Speichern. Bitte versuche es erneut.")
    }
    cancelSelection(user.discordId)
    setSaving(null)
  }

  // ── Kaufeinstellungen helpers ─────────────────────────────────────────────
  const setPremium = (v: boolean) => setAvail((a) => ({ ...a, premium: v }))
  const setGame    = (name: string, v: boolean) =>
    setAvail((a) => ({ ...a, games: { ...a.games, [name]: v } }))

  const allGamesOn = GAME_NAMES.every((g) => avail.games[g] !== false)
  const toggleAll  = () =>
    setAvail((a) => ({ ...a, games: Object.fromEntries(GAME_NAMES.map((g) => [g, !allGamesOn])) }))

  // Rabatt-Setter
  const setPremiumDiscount = (pct: number | undefined) =>
    setAvail((a) => ({
      ...a,
      discounts: { ...a.discounts, premium: pct },
    }))

  const setGameDiscount = (name: string, pct: number | undefined) =>
    setAvail((a) => ({
      ...a,
      discounts: {
        ...a.discounts,
        games: { ...(a.discounts.games ?? {}), [name]: pct as number },
      },
    }))

  const clearGameDiscount = (name: string) =>
    setAvail((a) => {
      const games = { ...(a.discounts.games ?? {}) }
      delete games[name]
      return { ...a, discounts: { ...a.discounts, games } }
    })

  const clearPremiumDiscount = () =>
    setAvail((a) => {
      const d = { ...a.discounts }
      delete d.premium
      return { ...a, discounts: d }
    })

  // Alle Rabatte zurücksetzen
  const clearAllDiscounts = () =>
    setAvail((a) => ({ ...a, discounts: {} }))

  const hasAnyDiscount =
    (avail.discounts.premium !== undefined && avail.discounts.premium > 0) ||
    Object.values(avail.discounts.games ?? {}).some((v) => v > 0)

  async function handleAvailSave() {
    setAvailSaving(true)

    // Rabatte aufräumen: undefined-Werte und 0 entfernen bevor gespeichert wird
    const cleanGames: Record<string, number> = {}
    for (const [name, pct] of Object.entries(avail.discounts.games ?? {})) {
      if (pct !== undefined && pct > 0) cleanGames[name] = pct
    }
    const cleanDiscounts: DiscountsState = {}
    if (avail.discounts.premium !== undefined && avail.discounts.premium > 0)
      cleanDiscounts.premium = avail.discounts.premium
    if (Object.keys(cleanGames).length > 0)
      cleanDiscounts.games = cleanGames

    const payload: AvailState = {
      ...avail,
      discounts: cleanDiscounts,
    }

    const ok = await saveAvail(payload)
    setAvailSaving(false)
    if (ok) {
      setAvailSaved(true)
      addToast("success", "Kaufeinstellungen gespeichert.")
      setTimeout(() => setAvailSaved(false), 2500)
    } else {
      addToast("error", "Fehler beim Speichern.")
    }
  }

  // ── Guards ───────────────────────────────────────────────────────────────
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
    { key: "berechtigungen",   label: "Berechtigungen",   locked: false },
    { key: "zentrale",         label: "Zentrale",          locked: false },
    { key: "kaufeinstellungen",label: "Kaufeinstellungen", locked: !isCryptix },
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
              onClick={() => { if (!tab.locked) setActiveTab(tab.key) }}
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
                <svg className="w-3 h-3 text-gray-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── BERECHTIGUNGEN ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "berechtigungen" && (
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const catUsers    = users.filter((u) =>
              cat.positions.some((p) => u.position?.toLowerCase().includes(p.toLowerCase()))
            )
            const isFounder   = cat.label === "Gründer"
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
                    const isFounderUser  = user.discordId === CRYPTIX_ID
                    const displayTitle   = getDisplayTitle(user, cat)
                    const isOpen         = openDropdown === user.discordId
                    const pendingValue   = pendingSelections[user.discordId]
                    const hasPending     = pendingValue !== undefined && pendingValue !== user.role
                    const isSavingThis   = saving === user.discordId

                    return (
                      <div key={user.discordId} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm">{user.discordName || user.discordId}</p>
                          <p className="text-xs text-gray-500">{user.position}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {isFounderUser ? (
                            <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-full">Gründer</span>
                          ) : isCryptix ? (
                            <div className="relative" data-dropdown>
                              <button
                                onClick={() => {
                                  if (isOpen) { setOpenDropdown(null); cancelSelection(user.discordId) }
                                  else { setOpenDropdown(user.discordId); setPendingSelections((prev) => ({ ...prev, [user.discordId]: user.role })) }
                                }}
                                disabled={isSavingThis}
                                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition ${
                                  user.role === "PERSONAL_MANAGER"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                                    : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
                                } disabled:opacity-40`}
                              >
                                {isSavingThis && <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
                                {displayTitle}
                                <span className="text-gray-600">▾</span>
                              </button>
                              {isOpen && (
                                <div className="absolute right-0 top-10 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
                                  <div className="px-3 py-2 border-b border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Rolle wählen</p>
                                  </div>
                                  {["VIEWER", ...(cat.managerTitle ? ["PERSONAL_MANAGER"] : [])].map((roleKey) => (
                                    <button
                                      key={roleKey}
                                      onClick={() => selectOption(user.discordId, roleKey)}
                                      className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center justify-between ${
                                        (pendingValue ?? user.role) === roleKey ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-300"
                                      }`}
                                    >
                                      {roleKey === "VIEWER" ? "Viewer" : cat.managerTitle}
                                      {(pendingValue ?? user.role) === roleKey && <span className="text-green-400 text-xs">✓</span>}
                                    </button>
                                  ))}
                                  {!cat.managerTitle && (
                                    <div className="px-4 py-2.5 text-xs text-gray-600 italic">Keine weiteren Optionen</div>
                                  )}
                                  <div className="flex gap-2 px-3 py-3 border-t border-gray-700">
                                    <button onClick={() => cancelSelection(user.discordId)} className="flex-1 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300">Abbrechen</button>
                                    <button onClick={() => saveRole(user)} disabled={!hasPending} className="flex-1 py-1.5 text-xs bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition text-white font-medium">Speichern</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className={`text-xs px-2.5 py-1 rounded-full border ${
                              user.role === "PERSONAL_MANAGER"
                                ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                            }`}>{displayTitle}</span>
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── ZENTRALE ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
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
              <div key={user.discordId} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
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
                      {zentraleSaving === user.discordId && <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
                      {user.canAccess ? "Zugriff aktiv" : "Kein Zugriff"}
                    </button>
                  ) : (
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      user.canAccess ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                    }`}>{user.canAccess ? "Zugriff aktiv" : "Kein Zugriff"}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── KAUFEINSTELLUNGEN ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === "kaufeinstellungen" && isCryptix && (
        <div className="space-y-8 max-w-lg">
          <p className="text-xs text-gray-500">
            Aktiviere oder deaktiviere Premium und einzelne Spiele auf der Kaufseite. Setze Rabattaktionen pro Artikel.
          </p>

          {/* ── VERFÜGBARKEIT: Premium ── */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Verfügbarkeit · Premium</p>
            <AvailToggle
              value={avail.premium}
              onChange={setPremium}
              label="AstroPlays Premium"
              sublabel='Deaktiviert: "Aktuell nicht verfügbar" auf der Kaufseite'
            />
          </div>

          {/* ── VERFÜGBARKEIT: Spielothek ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Verfügbarkeit · Spielothek</p>
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

          {/* ── RABATTAKTIONEN ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Rabattaktionen</p>
                <p className="text-xs text-gray-700 mt-1">
                  Gib einen Prozentsatz ein (1–99). Der neue Preis wird live berechnet.
                </p>
              </div>
              {hasAnyDiscount && (
                <button
                  onClick={clearAllDiscounts}
                  className="text-xs text-red-500/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-3 py-1 rounded-lg transition"
                >
                  Alle entfernen
                </button>
              )}
            </div>

            {/* Hinweis zur Preisrundung */}
            <div className="flex gap-2.5 bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
              <span className="text-yellow-500/70 text-sm flex-shrink-0">ⓘ</span>
              <p className="text-xs text-gray-600 leading-relaxed">
                Preise werden kaufmännisch auf 2 Dezimalstellen gerundet (z.B. 3,99€ × 80% = 3,19€).
                Der ausgewiesene Rabattsatz stimmt damit exakt überein — rechtlich korrekt nach deutschem Preisrecht.
              </p>
            </div>

            {/* Premium Rabatt */}
            <div className="space-y-1">
              <p className="text-[11px] text-gray-600 uppercase tracking-wider px-1">Premium Pass</p>
              <DiscountInput
                label="AstroPlays Premium"
                originalPrice="11,25"
                value={avail.discounts.premium}
                onChange={setPremiumDiscount}
                onClear={clearPremiumDiscount}
              />
            </div>

            {/* Spielothek Rabatte */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] text-gray-600 uppercase tracking-wider px-1">Spielothek</p>
              {GAME_NAMES.map((name) => (
                <DiscountInput
                  key={name}
                  label={name}
                  originalPrice="3,99"
                  value={avail.discounts.games?.[name]}
                  onChange={(pct) => setGameDiscount(name, pct)}
                  onClear={() => clearGameDiscount(name)}
                />
              ))}
            </div>
          </div>

          {/* ── SPEICHERN ── */}
          <button
            onClick={handleAvailSave}
            disabled={availSaving}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background:  availSaved ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#6366f1,#a855f7)",
              boxShadow:   availSaved ? "0 0 24px rgba(34,197,94,0.2)"            : "0 0 24px rgba(99,102,241,0.18)",
              cursor:      availSaving ? "wait" : "pointer",
            }}
          >
            {availSaving ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Speichern…</>
            ) : availSaved ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Gespeichert!</>
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
            <button onClick={() => removeToast(toast.id)} className="text-current opacity-50 hover:opacity-100 transition ml-1">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
