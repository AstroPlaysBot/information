// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const cookieStore = cookies();
  const userToken = cookieStore.get('user_token');
  const adminToken = cookieStore.get('admin_token');

  if (!userToken && !adminToken) {
    redirect('/');
  }

  return <DashboardClient />;
}
