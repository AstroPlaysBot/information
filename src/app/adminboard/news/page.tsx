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
      return <p key={i} className="text-2xl font-bold text-white mt-2">{parseLine(line.slice(2))}</p>
    }
    if (line.startsWith("## ")) {
      return <p key={i} className="text-lg font-semibold text-white mt-1">{parseLine(line.slice(3))}</p>
    }
    if (line.startsWith("### ")) {
      return <p key={i} className="text-base font-semibold text-gray-200 mt-1">{parseLine(line.slice(4))}</p>
    }
    if (line.trim() === "---") {
      return <hr key={i} className="border-gray-700 my-3" />
    }
    if (line.trim() === "") {
      return <br key={i} />
    }
    return <p key={i} className="text-gray-200 text-sm leading-relaxed">{parseLine(line)}</p>
  })
}

function parseLine(text: string) {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    if (match[2]) parts.push(<strong key={match.index} className="text-white font-bold">{match[2]}</strong>)
    else if (match[3]) parts.push(<em key={match.index} className="italic text-gray-300">{match[3]}</em>)
    else if (match[4]) parts.push(<code key={match.index} className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">{match[4]}</code>)
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [myRole, setMyRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)

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
    <div className="min-h-screen bg-gray-950 text-white px-8 py-8 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Neuigkeiten</h1>

      {/* Editor — nur für Cryptix */}
      {canEdit && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Neue Nachricht</p>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none transition font-mono"
            placeholder={"# Überschrift\n**Fett**, *Kursiv*, `Code`\n---\nDein Text hier..."}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">Unterstützt: # ## ### **fett** *kursiv* `code` ---</p>
            <button
              onClick={createPost}
              disabled={saving || !content.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition rounded-lg text-sm font-semibold"
            >
              {saving ? "Speichern..." : "Veröffentlichen"}
            </button>
          </div>
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600 text-sm py-10">Noch keine Neuigkeiten vorhanden.</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
              {editingId === post.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={5}
                    className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-gray-500 resize-none transition font-mono"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setEditingId(null); setEditContent("") }}
                      className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={updatePost}
                      disabled={saving}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg text-sm transition"
                    >
                      Speichern
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    {renderDiscordMarkdown(post.content)}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <p className="text-xs text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString('de-DE')} um {new Date(post.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                      {post.updatedAt !== post.createdAt && " · bearbeitet"}
                    </p>
                    {canEdit && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingId(post.id); setEditContent(post.content) }}
                          className="text-xs text-gray-500 hover:text-white transition px-2 py-1 rounded hover:bg-gray-800"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-xs text-red-500 hover:text-red-400 transition px-2 py-1 rounded hover:bg-gray-800"
                        >
                          Löschen
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
