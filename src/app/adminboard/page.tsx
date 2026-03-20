// src/app/adminboard/page.tsx
'use client'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import AdminAnimation from './AdminAnimation'
import AdminBoardWrapper from './AdminBoardWrapper'

export const dynamic = 'force-dynamic'

export default function AdminBoardPage() {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')

  if (!adminToken) {
    redirect('/')
  }

  // Steuerung, ob Animation oder Board gezeigt wird
  const [showAnimation, setShowAnimation] = useState(true)

  return (
    <>
      {showAnimation ? (
        <AdminAnimation onFinish={() => setShowAnimation(false)} />
      ) : (
        <AdminBoardWrapper />
      )}
    </>
  )
}
