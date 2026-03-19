'use client'

import { useEffect, useState } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminBoardClient from './AdminBoardClient'
import AdminAnimation from '../../components/AdminAnimation'

export const dynamic = 'force-dynamic'

export default function AdminBoardPage() {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')

  if (!adminToken) {
    redirect('/')
  }

  // === NEU: State für Animation ===
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 10000) // 10 Sekunden
    return () => clearTimeout(timer)
  }, [])

  // === Render ===
  if (showAnimation) return <AdminAnimation /> // Animation einmalig

  return <AdminBoardClient /> // echtes Dashboard danach
}
