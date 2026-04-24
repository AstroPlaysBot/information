'use client'

// ════════════════════════════════════════════════════════════════════════════
// app/(legal)/layout.tsx
//
// ⚠ VERSIONSPFLEGE:
//   Wenn du ein Dokument aktualisierst, hier die Version + das Datum
//   ebenfalls anpassen — diese Werte erscheinen im Sidebar-Badge und
//   geben dem Nutzer Transparenz darüber welche Version er gerade liest.
// ════════════════════════════════════════════════════════════════════════════

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Versionen synchron zu den jeweiligen page.tsx-Kommentaren halten
const DOC_META: Record<string, { version: string; date: string; label: string; sublabel: string }> = {
  "/AGB": {
    version:  "1.0",
    date:     "23.04.2025",
    label:    "AGB",
    sublabel: "Terms of Service",
  },
  "/Impressum": {
    version:  "1.0",
    date:     "23.04.2025",
    label:    "Impressum",
    sublabel: "Legal Notice",
  },
  "/Datenschutz": {
    version:  "1.0",
    date:     "23.04.2025",
    label:    "Datenschutz",
    sublabel: "Privacy Policy",
  },
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const current  = DOC_META[pathname]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 px-4 sm:px-6 lg:px-20 py-16">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">

          {/* Navigation */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">AstroPlaysBot</h2>
            <nav className="flex flex-col gap-1.5 text-sm">
              {Object.entries(DOC_META).map(([href, meta]) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2.5 rounded-lg transition-colors flex flex-col gap-0.5 ${
                      isActive
                        ? "bg-purple-600/80 text-white font-medium"
                        : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <span>{meta.label}</span>
                    <span className={`text-[11px] ${isActive ? "text-purple-200/70" : "text-gray-600"}`}>
                      {meta.sublabel}
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Kontakt */}
            <div className="border-t border-gray-800 mt-6 pt-4 text-sm space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Kontakt</p>
              <p className="text-gray-400">
                Discord:{" "}
                <a
                  href="https://discord.gg/astroplays"
                  className="text-purple-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Server beitreten
                </a>
              </p>
              <p className="text-gray-400">
                E-Mail:{" "}
                <a
                  href="mailto:astroplays.help@gmail.com"
                  className="text-purple-400 hover:underline"
                >
                  astroplays.help@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Versions-Badge der aktuell angezeigten Seite */}
          {current && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 space-y-3">
              <p className="text-gray-600 uppercase tracking-wider text-[10px] font-medium">
                Dokument-Info
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Version</span>
                <span className="text-white font-bold font-mono">V{current.version}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Stand</span>
                <span className="text-gray-300 font-mono text-xs">{current.date}</span>
              </div>
              <p className="text-gray-700 text-[10px] leading-relaxed pt-1 border-t border-gray-800">
                Zum Zeitpunkt eines Kaufs wird die dann gültige Version
                protokolliert und kann auf Anfrage nachgewiesen werden.
              </p>
            </div>
          )}

        </aside>

        {/* ── CONTENT ── */}
        <main className="flex-1 max-w-4xl w-full">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 md:p-10 shadow-lg">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}
