// src/app/adminboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminboardClient from './AdminboardClient';

export default async function AdminboardPage() {
  const token = cookies().get('discord_token')?.value;
  if (!token) redirect('/');

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
    headers: {
      cookie: `discord_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) redirect('/');

  const data = await res.json();
  return <AdminboardClient applications={data.applications || []} />;
}
