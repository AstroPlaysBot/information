'use client'

import { rules } from './config'

export default function RulesPage(){

  return (

    <div className="p-12 max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        Admin Regeln
      </h1>

      <div className="space-y-4 text-gray-300">

        {rules.map((rule,i)=>(
          <p key={i}>
            {i+1}. {rule}
          </p>
        ))}

      </div>

    </div>

  )
}
