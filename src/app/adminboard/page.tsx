// src/app/adminboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminBoardClientLoader from './AdminBoardClientLoader'

export const dynamic = 'force-dynamic'

export default function AdminBoardPage() {
  const adminToken = cookies().get('admin_token')
  if (!adminToken) redirect('/')

  return <AdminBoardClientLoader />
}
