'use client'
import { useEffect, useState } from "react"

const CRYPTIX_ID = "1462891063202156807"

const BADGES = [
  { key: "ALLGEMEIN", label: "Allgemein", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { key: "LOESCHANTRAG", label: "Löschantrag", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  { key: "BUG", label: "Bug / Fehler", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  { key: "FEATURE", label: "Feature Anfrage", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { key: "BESCHWERDE", label: "Beschwerde", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  { key: "SONSTIGES", label: "Sonstiges", color: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
]

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Offen",
  IN_PROGRESS: "In Bearbeitung",
  CLOSED: "Geschlossen",
  ARCHIVED: "Archiviert",
}

function getBadge(key: string | null) {
  return BADGES.find(b => b.key === key) || null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "gerade eben"
  if (mins < 60) return `vor ${mins} Min.`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `vor ${hours} Std.`
  const days = Math.floor(hours / 24)
  if (days < 7) return `vor ${days} Tag${days !== 1 ? 'en' : ''}`
  return new Date(dateStr).toLocaleDateString('de-DE')
}

interface Ticket {
  id: string
  ticketId: string
  senderMail: string
  senderName: string | null
  subject: string
  badge: string | null
  status: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  content: string
  fromMail: string
  fromName: string | null
  isStaff: boolean
  staffName: string | null
  createdAt: string
}

export default function ZentralePage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [myDiscordId, setMyDiscordId] = useState<string | null>(null)
  const [myName, setMyName] = useState<string>("Unbekannt")
  const [myRole, setMyRole] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [filterBadge, setFilterBadge] = useState("")
  const [filterStatus, setFilterStatus] = useState("OPEN")

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const [showBadgeDropdown, setShowBadgeDropdown] = useState(false)
  const [settingBadge, setSettingBadge] = useState(false)
  const [closing, setClosing] = useState(false)

  const isCryptix = myDiscordId === CRYPTIX_ID

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setMyDiscordId(d.discordId)
        setMyName(d.username || "Unbekannt")
        setMyRole(d.role)
      })
      .catch(() => {})
    loadTickets()
  }, [])

  useEffect(() => {
    loadTickets()
  }, [filterBadge, filterStatus])

  async function loadTickets() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (filterBadge) params.set("badge", filterBadge)
      if (filterStatus) params.set("status", filterStatus)
      const res = await fetch(`/api/adminboard/tickets?${params.toString()}`, { credentials: "include" })
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  async function sendReply() {
    if (!reply.trim() || !selectedTicket) return
    setSending(true)
    try {
      const res = await fetch("/api/adminboard/tickets/reply", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id, content: reply })
      })
      const data = await res.json()
      if (data.success) {
        setReply("")
        // Nachricht optimistisch hinzufügen
        const newMsg: Message = {
          id: Date.now().toString(),
          content: reply,
          fromMail: "staff",
          fromName: myName,
          isStaff: true,
          staffName: myName,
          createdAt: new Date().toISOString()
        }
        setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev)
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, messages: [...t.messages, newMsg] } : t))
      }
    } catch {}
    setSending(false)
  }

  async function setBadge(badge: string) {
    if (!selectedTicket) return
    setSettingBadge(true)
    try {
      const res = await fetch("/api/adminboard/tickets/badge", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id, badge })
      })
      const data = await res.json()
      if (data.success) {
        setSelectedTicket(prev => prev ? { ...prev, badge, status: "IN_PROGRESS" } : prev)
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, badge, status: "IN_PROGRESS" } : t))
      }
    } catch {}
    setShowBadgeDropdown(false)
    setSettingBadge(false)
  }

  async function closeTicket() {
    if (!selectedTicket || !isCryptix) return
    setClosing(true)
    try {
      const res = await fetch("/api/adminboard/tickets/close", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id })
      })
      const data = await res.json()
      if (data.success) {
        setSelectedTicket(prev => prev ? { ...prev, status: "CLOSED" } : prev)
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: "CLOSED" } : t))
      }
    } catch {}
    setClosing(false)
  }

  const canReply = selectedTicket?.badge !== "LOESCHANTRAG" || isCryptix

  return (
    <div className="flex h-full min-h-0 bg-gray-950 text-white">

      {/* Linke Spalte — Ticket Liste */}
      <div className="w-96 border-r border-gray-800/60 flex flex-col min-h-0">

        {/* Suche + Filter */}
        <div className="p-4 border-b border-gray-800/60 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadTickets()}
              placeholder="Ticket-ID oder Mail suchen..."
              className="w-full bg-gray-900 border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition pr-10"
            />
            <button
              onClick={loadTickets}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-xs"
            >
              ↵
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700/60 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
            >
              <option value="">Alle Status</option>
              <option value="OPEN">Offen</option>
              <option value="IN_PROGRESS">In Bearbeitung</option>
              <option value="CLOSED">Geschlossen</option>
            </select>
            <select
              value={filterBadge}
              onChange={e => setFilterBadge(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700/60 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
            >
              <option value="">Alle Kategorien</option>
              {BADGES.map(b => (
                <option key={b.key} value={b.key}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ticket Liste */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">Keine Tickets gefunden</p>
            </div>
          ) : (
            tickets.map(ticket => {
              const badge = getBadge(ticket.badge)
              const isSelected = selectedTicket?.id === ticket.id
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left px-4 py-4 border-b border-gray-800/40 transition ${
                    isSelected ? "bg-gray-800/60" : "hover:bg-gray-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-blue-400">{ticket.ticketId}</span>
                    <span className="text-xs text-gray-600 shrink-0">{timeAgo(ticket.updatedAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{ticket.subject}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{ticket.senderName || ticket.senderMail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {badge ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-800 text-gray-500 border-gray-700">
                        Kein Badge
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      ticket.status === "OPEN" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      ticket.status === "IN_PROGRESS" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      "bg-gray-500/10 text-gray-500 border-gray-500/20"
                    }`}>
                      {STATUS_LABELS[ticket.status] || ticket.status}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Rechte Spalte — Ticket Detail */}
      <div className="flex-1 flex flex-col min-h-0">
        {!selectedTicket ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-sm">Kein Ticket ausgewählt</p>
              <p className="text-gray-700 text-xs">Wähle ein Ticket aus der Liste</p>
            </div>
          </div>
        ) : (
          <>
            {/* Ticket Header */}
            <div className="px-6 py-4 border-b border-gray-800/60 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-blue-400">{selectedTicket.ticketId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      selectedTicket.status === "OPEN" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      selectedTicket.status === "IN_PROGRESS" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      "bg-gray-500/10 text-gray-500 border-gray-500/20"
                    }`}>
                      {STATUS_LABELS[selectedTicket.status]}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedTicket.subject}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedTicket.senderName && <span>{selectedTicket.senderName} · </span>}
                    {selectedTicket.senderMail}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Badge setzen */}
                  <div className="relative">
                    <button
                      onClick={() => setShowBadgeDropdown(v => !v)}
                      disabled={settingBadge || selectedTicket.badge === "LOESCHANTRAG" && !isCryptix}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition disabled:opacity-40"
                    >
                      {settingBadge ? (
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : null}
                      {selectedTicket.badge ? getBadge(selectedTicket.badge)?.label : "Badge vergeben"}
                      <span className="text-gray-600">▾</span>
                    </button>
                    {showBadgeDropdown && (
                      <div className="absolute right-0 top-9 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[180px]">
                        {BADGES.filter(b => {
                          if (b.key === "LOESCHANTRAG" && !isCryptix) return false
                          return true
                        }).map(b => (
                          <button
                            key={b.key}
                            onClick={() => setBadge(b.key)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 transition flex items-center gap-2"
                          >
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${b.color}`}>
                              {b.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Schließen */}
                  {isCryptix && selectedTicket.status !== "CLOSED" && (
                    <button
                      onClick={closeTicket}
                      disabled={closing}
                      className="text-xs px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition disabled:opacity-40"
                    >
                      {closing ? "..." : "Schließen"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Nachrichten */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {selectedTicket.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 space-y-1 ${
                    msg.isStaff
                      ? "bg-blue-600/20 border border-blue-500/20"
                      : "bg-gray-900 border border-gray-800"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.isStaff ? "text-blue-400" : "text-gray-400"}`}>
                        {msg.isStaff ? (msg.staffName || "Team") : (msg.fromName || msg.fromMail)}
                      </span>
                      <span className="text-xs text-gray-600">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selectedTicket.status !== "CLOSED" && (
              <div className="px-6 py-4 border-t border-gray-800/60">
                {!canReply ? (
                  <p className="text-xs text-gray-600 text-center py-2">
                    🔒 Nur der Gründer kann auf Löschanträge antworten.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendReply()
                      }}
                      rows={3}
                      placeholder="Antwort schreiben... (Strg+Enter zum Senden)"
                      className="w-full bg-gray-900 border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none transition"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={sendReply}
                        disabled={sending || !reply.trim()}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition rounded-xl text-sm font-semibold"
                      >
                        {sending ? "Wird gesendet..." : "Antworten"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTicket.status === "CLOSED" && (
              <div className="px-6 py-4 border-t border-gray-800/60">
                <p className="text-xs text-gray-600 text-center">Dieses Ticket ist geschlossen.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
