'use client'
import { useRouter } from 'next/navigation'
import { Wrench } from 'lucide-react'

interface MaintenanceBannerProps {
  reason: string
}

export default function MaintenanceBanner({ reason }: MaintenanceBannerProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <Wrench size={28} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-3">Wartungsarbeiten</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{reason}</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  )
}
