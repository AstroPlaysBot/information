// src/app/adminboard/AdminBoardClientLoader.tsx
'use client'

import { useState } from 'react'
import AdminAnimation from './AdminAnimation'
import AdminBoardWrapper from './AdminBoardWrapper'

export default function AdminBoardClientLoader() {
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
