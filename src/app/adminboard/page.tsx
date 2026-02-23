// src/app/adminboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminboardClient, { Application } from './AdminboardClient';

export default async function AdminboardPage() {
  // 🍪 Token aus Cookie
  const token = cookies().get('discord_token')?.value;
  if (!token) redirect('/');

  // 🔹 Admin-Check via API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin-check`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const check = await res.json();
  if (!check.allowed) redirect('/?error=no_admin');

  // 🔹 Bewerbungen laden
  const appsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
    cache: 'no-store',
  });
  const appsData = await appsRes.json();
  const applications: Application[] = appsData?.applications || [];

  // 🔹 Server Component gibt die Daten an Client Component weiter
  return <AdminboardClient applications={applications} />;
}
