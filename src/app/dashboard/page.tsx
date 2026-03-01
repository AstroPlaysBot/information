// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const cookieStore = cookies();
  const userToken = cookieStore.get('user_token');
  const adminToken = cookieStore.get('admin_token');

  if (!userToken && !adminToken) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      <h1 className="text-4xl">Dashboard</h1>
    </div>
  );
}
