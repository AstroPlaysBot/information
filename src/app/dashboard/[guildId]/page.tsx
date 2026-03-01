// src/app/dashboard/[guildId]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardSidebar from '../DashboardSidebar';

interface PageProps {
  params: { guildId: string };
}

export const dynamic = 'force-dynamic';

export default function GuildPage({ params }: PageProps) {
  const cookieStore = cookies();
  const userToken = cookieStore.get('user_token');
  const adminToken = cookieStore.get('admin_token');

  if (!userToken && !adminToken) redirect('/');

  const { guildId } = params;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Server Dashboard: {guildId}</h1>
        <p>Hier kannst du Einstellungen für diesen Server verwalten.</p>
      </main>
    </div>
  );
}
