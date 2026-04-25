'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'

const OWNER_ID = "1462891063202156807"

interface MaintenancePage {
  path: string
  reason: string
}

interface MaintenanceViewProps {
  session?: any
}

export default function MaintenanceView({ session }: MaintenanceViewProps) {
  const isOwner = session?.user?.id === OWNER_ID
  const [pages, setPages] = useState<MaintenancePage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/adminboard/maintenance', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPages(d.pages ?? []))
      .catch(() => setErrorMsg('Fehler beim Laden.'))
      .finally(() => setLoading(false))
  }, [])

  const addPage = () => {
    setPages(prev => [...prev, { path: '', reason: '' }])
  }

  const updatePage = (index: number, field: keyof MaintenancePage, value: string) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }

  const removePage = (index: number) => {
    setPages(prev => prev.filter((_, i) => i !== index))
  }

  const save = async () => {
    // Validate: all paths and reasons must be filled
    for (const p of pages) {
      if (!p.path.trim() || !p.reason.trim()) {
        setErrorMsg('Alle Felder (Pfad & Grund) müssen ausgefüllt sein.')
        return
      }
      if (!p.path.startsWith('/')) {
        setErrorMsg(`Pfade müssen mit / beginnen (z.B. /dashboard). Fehler bei: "${p.path}"`)
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

      <div className="flex flex-col gap-4 mb-6">
        {pages.map((page, i) => (
          <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Pfad</label>
                {isOwner ? (
                  <input
                    type="text"
                    value={page.path}
                    onChange={e => updatePage(i, 'path', e.target.value)}
                    placeholder="/dashboard"
                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500 font-mono"
                  />
                ) : (
                  <span className="text-white font-mono text-sm">{page.path}</span>
                )}
              </div>
              {isOwner && (
                <button
                  onClick={() => removePage(i)}
                  className="text-gray-600 hover:text-red-400 transition mt-5"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Grund <span className="text-red-500">*</span></label>
              {isOwner ? (
                <textarea
                  value={page.reason}
                  onChange={e => updatePage(i, 'reason', e.target.value)}
                  placeholder="Warum ist diese Seite unter Wartung?"
                  rows={2}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                />
              ) : (
                <span className="text-gray-300 text-sm">{page.reason}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="flex items-center gap-3">
          <button
            onClick={addPage}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-xl border border-gray-800 hover:border-gray-600"
          >
            <Plus size={15} />
            Seite hinzufügen
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 text-sm bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Speichert…' : 'Speichern'}
          </button>
        </div>
      )}

      {successMsg && (
        <p className="mt-4 text-green-400 text-sm">{successMsg}</p>
      )}
      {errorMsg && (
        <p className="mt-4 text-red-400 text-sm">{errorMsg}</p>
      )}
    </div>
  )
}
