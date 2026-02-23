// app/adminboard/page.tsx
import AdminBoardClient from './AdminBoardClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminBoardPage() {
  const token = cookies().get('discord_token')?.value;

  if (!token) {
    // Kein Token → redirect
    redirect('/?error=admin');
  }

  // Admin Check
  try {
    const adminRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin-check`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const adminData = await adminRes.json();
    if (!adminData.allowed) {
      redirect('/?error=admin');
    }
  } catch {
    redirect('/?error=admin');
  }

  // Bewerbungen laden
  let applications = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    applications = (await res.json()).applications || [];
  } catch (err) {
    console.error(err);
  }

  return <AdminBoardClient applications={applications} />;
}
