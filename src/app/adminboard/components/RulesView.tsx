'use client'

import { useState } from "react"
import { rules } from "../rules/config"

export default function RulesView() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="p-10 space-y-6 text-white">

      <h1 className="text-2xl font-bold">Regeln & Richtlinien</h1>
      <p className="text-sm text-gray-500">
        Interne Richtlinien für das AdminBoard Verhalten und den Workflow.
      </p>

      <div className="space-y-4">

        {rules.map((section, i) => {
          const isOpen = open === section.category

          return (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
            >

              {/* Category Header */}
              <button
                onClick={() =>
                  setOpen(isOpen ? null : section.category)
                }
                className="w-full flex justify-between items-center p-5 hover:bg-gray-800 transition"
              >
                <span className="font-semibold text-left">
                  {section.category}
                </span>

                <span className="text-gray-500 text-sm">
                  {section.items.length} Regeln
                </span>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-800">

                  {section.items.map((rule, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/60 border border-gray-700 rounded-xl p-4"
                    >
                      <p className="font-medium text-blue-400">
                        {rule.title}
                      </p>
                      <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  ))}

                </div>
              )}

            </div>
          )
        })}

      </div>
    </div>
  )
}
