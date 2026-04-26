'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, Pencil, X, Check } from 'lucide-react'

interface MaintenancePage {
  path: string
  reason: string
}

const ALL_PATHS = [
  '/dashboard',
  '/purchase',
  '/apply',
  '/team',
  '/login',
  '/world-league/leaderboard',
  '/world-league/rules',
]

export default function MaintenanceView() {
  const [isOwner, setIsOwner] = useState(false)
  const [pages, setPages] = useState<MaintenancePage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<MaintenancePage | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/adminboard/my-role', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setIsOwner(d.role === 'OWNER'))
      .catch(() => {})

    fetch('/api/adminboard/maintenance', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPages(d.pages ?? []))
      .catch(() => setErrorMsg('Fehler beim Laden.'))
      .finally(() => setLoading(false))
  }, [])

  const availablePaths = ALL_PATHS.filter(p => !pages.some(page => page.path === p))

  const addPage = () => {
    const newIndex = pages.length
    setPages(prev => [...prev, { path: '', reason: '' }])
    setEditingIndex(newIndex)
    setDraft({ path: '', reason: '' })
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setDraft({ ...pages[index] })
    setSuggestions([])
  }

  const cancelEdit = (index: number) => {
    // if it was a new empty entry, remove it
    if (!pages[index].path && !pages[index].reason) {
      setPages(prev => prev.filter((_, i) => i !== index))
    }
    setEditingIndex(null)
    setDraft(null)
    setSuggestions([])
  }

  const confirmEdit = (index: number) => {
    if (!draft) return
    if (!draft.path.trim() || !draft.reason.trim()) {
      setErrorMsg('Pfad und Grund müssen ausgefüllt sein.')
      return
    }
    if (!draft.path.startsWith('/')) {
      setErrorMsg('Pfad muss mit / beginnen.')
      return
    }
    setErrorMsg('')
    setPages(prev => prev.map((p, i) => i === index ? draft : p))
    setEditingIndex(null)
    setDraft(null)
    setSuggestions([])
  }

  const removePage = (index: number) => {
    setPages(prev => prev.filter((_, i) => i !== index))
    setEditingIndex(null)
    setDraft(null)
  }

  const handlePathInput = (value: string) => {
    if (!draft) return
    setDraft({ ...draft, path: value })
    if (value.startsWith('/')) {
      const filtered = availablePaths.filter(p =>
        p.startsWith(value) && p !== draft.path
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const save = async () => {
    for (const p of pages) {
      if (!p.path.trim() || !p.reason.trim()) {
        setErrorMsg('Alle Einträge müssen Pfad & Grund haben.')
        return
      }
    }
    setErrorMsg('')
    setSaving(true)
    try {
      const res = await fetch('/api/adminboard/maintenance', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages }),
      })
      if (!res.ok) throw new Error()
      setSuccessMsg('Gespeichert!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setErrorMsg('Speichern fehlgeschlagen.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Lädt…
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Wartungsarbeiten</h2>
      <p className="text-sm text-gray-500 mb-8">
        {isOwner
          ? 'Seiten unter Wartung verwalten. Besucher sehen eine Hinweisseite.'
          : 'Seiten, die aktuell unter Wartung stehen.'}
      </p>

      {pages.length === 0 && (
        <div className="text-gray-500 text-sm bg-gray-900/50 rounded-xl p-6 text-center mb-6">
          Keine Seiten unter Wartung.
        </div>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {pages.map((page, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            {editingIndex === i && draft ? (
              // ── Edit Mode ──
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <label className="text-xs text-gray-500 mb-1 block">Pfad</label>
                  <input
                    type="text"
                    value={draft.path}
                    onChange={e => handlePathInput(e.target.value)}
                    placeholder="/dashboard"
                    autoFocus
                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500 font-mono"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10">
                      {suggestions.map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            setDraft({ ...draft, path: s })
                            setSuggestions([])
                          }}
                          className="w-full text-left px-3 py-2 text-sm font-mono text-gray-300 hover:bg-gray-700 hover:text-white transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Grund <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={draft.reason}
                    onChange={e => setDraft({ ...draft, reason: e.target.value })}
                    placeholder="Warum ist diese Seite unter Wartung?"
                    rows={2}
                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => cancelEdit(i)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition"
                  >
                    <X size={13} /> Abbrechen
                  </button>
                  <button
                    onClick={() => confirmEdit(i)}
                    className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Check size={13} /> Übernehmen
                  </button>
                </div>
              </div>
            ) : (
              // ── View Mode ──
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-mono text-sm">{page.path}</span>
                  <span className="text-gray-400 text-sm">{page.reason}</span>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(i)}
                      className="text-gray-500 hover:text-white transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => removePage(i)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="flex items-center gap-3">
          <button
            onClick={addPage}
            disabled={editingIndex !== null}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-xl border border-gray-800 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={15} />
            Seite hinzufügen
          </button>
          <button
            onClick={save}
            disabled={saving || editingIndex !== null}
            className="flex items-center gap-2 text-sm bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {saving ? 'Speichert…' : 'Speichern'}
          </button>
        </div>
      )}

      {successMsg && <p className="mt-4 text-green-400 text-sm">{successMsg}</p>}
      {errorMsg && <p className="mt-4 text-red-400 text-sm">{errorMsg}</p>}
    </div>
  )
}
