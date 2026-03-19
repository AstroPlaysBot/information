'use client'

import { useEffect, useState } from 'react'
import AdminBoardClient from './AdminBoardClient'
import AdminAnimation from '../../components/AdminAnimation'

export default function AdminBoardWrapper() {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  if (showAnimation) return <AdminAnimation />

  return <AdminBoardClient />
}
