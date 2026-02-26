// src/app/adminboard/page.tsx
import { getTokenCookie } from '@/secure/session';
import { redirect } from 'next/navigation';
import AdminboardClient from './AdminboardClient';

export default async function AdminboardPage() {
  const token = getTokenCookie('personal_token');
  if (!token) redirect('/login');

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
    headers: { cookie: `personal_token=${token}` },
    cache: 'no-store',
  });

  if (!res.ok) redirect('/login');

  const data = await res.json();
  return <AdminboardClient applications={data.applications || []} />;
}
