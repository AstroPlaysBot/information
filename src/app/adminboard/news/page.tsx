'use client'
import { useEffect, useState } from "react"
import { CRYPTIX_ID } from "./config"

interface NewsPost {
  id: string
  content: string
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
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const canEdit = myRole === "OWNER"

  useEffect(() => {
    fetch("/api/adminboard/my-role", { credentials: "include" })
      .then(r => r.json())
      .then(d => setMyRole(d.role))
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
      loadPosts()
    } catch {}
    setSaving(false)
  }

  async function updatePost() {
    if (!editContent.trim() || !editingId) return
    setSaving(true)
    try {
      await fetch("/api/adminboard/news", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, content: editContent })
      })
      setEditingId(null)
      setEditContent("")
      loadPosts()
    } catch {}
    setSaving(false)
  }

  async function deletePost(id: string) {
    if (!confirm("Wirklich löschen?")) return
    await fetch("/api/adminboard/news", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Neuigkeiten</h1>
            <p className="text-xs text-gray-500 mt-0.5">Ankündigungen & Updates für das Team</p>
          </div>
          {!loading && (
            <span className="text-xs text-gray-600 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {posts.length} {posts.length === 1 ? 'Beitrag' : 'Beiträge'}
            </span>
          )}
        </div>

        {/* Editor */}
        {canEdit && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Neue Nachricht</p>
              <button
                onClick={() => setPreview(!preview)}
                className="text-xs text-gray-500 hover:text-gray-300 transition px-2.5 py-1 rounded-lg hover:bg-gray-800"
              >
                {preview ? "✏️ Bearbeiten" : "👁 Vorschau"}
              </button>
            </div>

            <div className="p-5 space-y-4">
              {preview ? (
                <div className="min-h-[120px] space-y-1 text-sm">
                  {content.trim()
                    ? renderDiscordMarkdown(content)
                    : <p className="text-gray-600 italic">Nichts zum Vorschauen...</p>
                  }
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none transition font-mono leading-relaxed"
                  placeholder={"# Überschrift\n**Fett**, *Kursiv*, `Code`\n---\nDein Text hier..."}
                />
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-700"># &nbsp;## &nbsp;### &nbsp;**fett** &nbsp;*kursiv* &nbsp;`code` &nbsp;---</p>
                <button
                  onClick={createPost}
                  disabled={saving || !content.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition rounded-lg text-sm font-semibold"
                >
                  {saving ? "Wird veröffentlicht..." : "Veröffentlichen"}
                </button>
              </div>
            </div>
          </div>
        )}

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
            {posts.map((post, idx) => (
              <div
                key={post.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
              >
                {/* Post meta */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-xs text-yellow-400 font-bold">
                      C
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-300">Cryptix</p>
                      <p className="text-xs text-gray-600">{timeAgo(post.createdAt)}{post.updatedAt !== post.createdAt && " · bearbeitet"}</p>
                    </div>
                  </div>
                  {canEdit && editingId !== post.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingId(post.id); setEditContent(post.content) }}
                        className="text-xs text-gray-600 hover:text-gray-300 transition px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-xs text-gray-600 hover:text-red-400 transition px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
                      >
                        Löschen
                      </button>
                    </div>
                  )}
                </div>

                {/* Post content */}
                <div className="px-5 py-4">
                  {editingId === post.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={5}
                        className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-gray-500 resize-none transition font-mono"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setEditingId(null); setEditContent("") }}
                          className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition text-gray-300"
                        >
                          Abbrechen
                        </button>
                        <button
                          onClick={updatePost}
                          disabled={saving}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg text-sm transition font-medium"
                        >
                          Speichern
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {renderDiscordMarkdown(post.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
