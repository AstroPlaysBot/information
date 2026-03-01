// src/app/adminboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminBoardClient from './AdminBoardClient';

export const dynamic = 'force-dynamic';

export default function AdminBoardPage() {
  const cookieStore = cookies();
  const adminToken = cookieStore.get('admin_token');

  if (!adminToken) {
    redirect('/');
  }

  return <AdminBoardClient />;
}
