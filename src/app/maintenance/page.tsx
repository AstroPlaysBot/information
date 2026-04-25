import { Suspense } from 'react'
import MaintenanceBanner from '../adminboard/components/MaintenanceBanner'

export default function MaintenancePage({
  searchParams,
}: {
  searchParams: { reason?: string }
}) {
  const reason = searchParams.reason ?? 'Diese Seite wird gerade gewartet.'
  return <MaintenanceBanner reason={reason} />
}
