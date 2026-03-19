import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminBoardWrapper from './AdminBoardWrapper'

export const dynamic = 'force-dynamic'

export default function AdminBoardPage() {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')

  if (!adminToken) {
    redirect('/')
  }

  // AdminToken ist da → Client Component laden
  return <AdminBoardWrapper />
}
