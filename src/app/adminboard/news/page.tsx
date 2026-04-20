'use client'
import { useEffect, useState } from "react"
import { CRYPTIX_ID } from "./config"

interface NewsPost {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

function renderDiscordMarkdown(text: string) {
  const lines = text.split("\n")
  return lines.map((line, i) => {
    if (line.startsWith("# ")) {
      return <p key={i} className="text-xl font-bold text-white mt-3 mb-1">{parseLine(line.slice(2))}</p>
    }
    if (line.startsWith("## ")) {
      return <p key={i} className="text-base font-semibold text-gray-100 mt-2">{parseLine(line.slice(3))}</p>
    }
    if (line.startsWith("### ")) {
      return <p key={i} className="text-sm font-semibold text-gray-300 mt-1">{parseLine(line.slice(4))}</p>
    }
    if (line.trim() === "---") {
      return <hr key={i} className="border-gray-700/60 my-4" />
    }
    if (line.trim() === "") {
      return <div key={i} className="h-2" />
    }
    return <p key={i} className="text-gray-300 text-sm leading-relaxed">{parseLine(line)}</p>
  })
}

function parseLine(text: string) {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    if (match[2]) parts.push(<strong key={match.index} className="text-white font-semibold">{match[2]}</strong>)
    else if (match[3]) parts.push(<em key={match.index} className="italic text-gray-400">{match[3]}</em>)
    else if (match[4]) parts.push(<code key={match.index} className="bg-gray-700/60 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-600/40">{match[4]}</code>)
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
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

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [myRole, setMyRole] = useState<string | null>(null)
  const [myDiscordId, setMyDiscordId] = useState<string | null>(null)
  const [myName, setMyName] = useState<string>("Unbekannt")
  const [loading, setLoading] = useState(true)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [content, setContent] = useState("")
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editingPost, setEditingPost] = useState<NewsPost | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editPreview, setEditPreview] = useState(false)

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const canCreate = myRole === "OWNER" || myRole === "PERSONAL_MANAGER"

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setMyRole(d.role)
        setMyDiscordId(d.discordId || null)
        setMyName(d.username || "Unbekannt")
      })
      .catch(() => {})
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch("/api/adminboard/news")
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  async function createPost() {
    if (!content.trim()) return
    setSaving(true)
    try {
      await fetch("/api/adminboard/news", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      })
      setContent("")
      setPreview(false)
      setShowCreateModal(false)
      loadPosts()
    } catch {}
    setSaving(false)
  }

  async function updatePost() {
    if (!editContent.trim() || !editingPost) return
    setSaving(true)
    try {
      await fetch("/api/adminboard/news", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPost.id, content: editContent })
      })
      setEditingPost(null)
      setEditContent("")
      setEditPreview(false)
      loadPosts()
    } catch {}
    setSaving(false)
  }

  async function deletePost() {
    if (!deleteTargetId) return
    setDeleting(true)
    try {
      await fetch("/api/adminboard/news", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTargetId })
      })
      setDeleteTargetId(null)
      loadPosts()
    } catch {}
    setDeleting(false)
  }

  const isAuthor = (post: NewsPost) =>
    myDiscordId === post.authorId || myDiscordId === CRYPTIX_ID

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Neuigkeiten</h1>
            <p className="text-xs text-gray-500 mt-0.5">Ankündigungen & Updates für das Team</p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <span className="text-xs text-gray-600 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
                {posts.length} {posts.length === 1 ? 'Beitrag' : 'Beiträge'}
              </span>
            )}
            {canCreate && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-xl text-sm font-semibold"
              >
                <span className="text-base leading-none">+</span>
                Beitrag erstellen
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-600">Lade Neuigkeiten...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-gray-500 text-sm font-medium">Noch keine Neuigkeiten</p>
            <p className="text-gray-700 text-xs">Hier erscheinen Ankündigungen sobald sie veröffentlicht werden.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

                {/* Meta */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-bold">
                      {(post.authorName || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-300">{post.authorName || "Unbekannt"}</p>
                      <p className="text-xs text-gray-600">
                        {timeAgo(post.createdAt)}
                        {post.updatedAt !== post.createdAt && " · bearbeitet"}
                      </p>
                    </div>
                  </div>

                  {isAuthor(post) && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingPost(post); setEditContent(post.content) }}
                        className="text-xs text-gray-600 hover:text-gray-300 transition px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(post.id)}
                        className="text-xs text-gray-600 hover:text-red-400 transition px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
                      >
                        Löschen
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-5 py-4 space-y-0.5">
                  {renderDiscordMarkdown(post.content)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-base font-bold">Beitrag erstellen</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreview(!preview)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition px-2.5 py-1 rounded-lg hover:bg-gray-800"
                >
                  {preview ? "✏️ Bearbeiten" : "👁 Vorschau"}
                </button>
                <button
                  onClick={() => { setShowCreateModal(false); setContent(""); setPreview(false) }}
                  className="text-gray-600 hover:text-white transition text-lg leading-none px-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {preview ? (
                <div className="min-h-[140px] space-y-1 text-sm bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                  {content.trim()
                    ? renderDiscordMarkdown(content)
                    : <p className="text-gray-600 italic">Nichts zum Vorschauen...</p>
                  }
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={7}
                  autoFocus
                  className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none transition font-mono leading-relaxed"
                  placeholder={"# Überschrift\n**Fett**, *Kursiv*, `Code`\n---\nDein Text hier..."}
                />
              )}
              <p className="text-xs text-gray-700"># &nbsp;## &nbsp;### &nbsp;**fett** &nbsp;*kursiv* &nbsp;`code` &nbsp;---</p>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setShowCreateModal(false); setContent(""); setPreview(false) }}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition rounded-xl text-sm"
              >
                Abbrechen
              </button>
              <button
                onClick={createPost}
                disabled={saving || !content.trim()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition rounded-xl text-sm font-semibold"
              >
                {saving ? "Wird veröffentlicht..." : "Veröffentlichen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-base font-bold">Beitrag bearbeiten</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditPreview(!editPreview)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition px-2.5 py-1 rounded-lg hover:bg-gray-800"
                >
                  {editPreview ? "✏️ Bearbeiten" : "👁 Vorschau"}
                </button>
                <button
                  onClick={() => { setEditingPost(null); setEditContent(""); setEditPreview(false) }}
                  className="text-gray-600 hover:text-white transition text-lg leading-none px-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {editPreview ? (
                <div className="min-h-[140px] space-y-1 text-sm bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                  {editContent.trim()
                    ? renderDiscordMarkdown(editContent)
                    : <p className="text-gray-600 italic">Nichts zum Vorschauen...</p>
                  }
                </div>
              ) : (
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={7}
                  autoFocus
                  className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-gray-500 resize-none transition font-mono leading-relaxed"
                />
              )}
              <p className="text-xs text-gray-700"># &nbsp;## &nbsp;### &nbsp;**fett** &nbsp;*kursiv* &nbsp;`code` &nbsp;---</p>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setEditingPost(null); setEditContent(""); setEditPreview(false) }}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition rounded-xl text-sm"
              >
                Abbrechen
              </button>
              <button
                onClick={updatePost}
                disabled={saving || !editContent.trim()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition rounded-xl text-sm font-semibold"
              >
                {saving ? "Speichern..." : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-base font-bold">Beitrag löschen</h2>
              <p className="text-sm text-gray-400">Dieser Beitrag wird unwiderruflich gelöscht. Bist du sicher?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition rounded-xl text-sm"
              >
                Abbrechen
              </button>
              <button
                onClick={deletePost}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 transition rounded-xl text-sm font-semibold"
              >
                {deleting ? "Löschen..." : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
