'use client'

import { rules } from './config'

export default function RulesPage() {
  return (
    <div className="p-12 max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        Admin Regeln
      </h1>

      <div className="space-y-8 text-gray-300">

        {rules.map((rule, i) => (
          <div key={i} className="space-y-2">

            <h2 className="text-xl font-semibold text-white">
              {i + 1}. {rule.category}
            </h2>

            <ul className="space-y-2 pl-4 list-disc">

              {rule.items.map((item, j) => (
                <li key={j}>
                  <p className="font-medium text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                </li>
              ))}

            </ul>

          </div>
        ))}

      </div>

    </div>
  )
}
