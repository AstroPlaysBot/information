// dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default async function DashboardPage({ searchParams }: { searchParams?: { token?: string } }) {
  // 🔹 Token aus Cookie oder Queryparam
  let token = cookies().get('discord_token')?.value;
  if (!token && searchParams?.token) {
    token = searchParams.token;
  }

  if (!token) redirect('/');

  let guilds: Guild[] = [];
  let user: { username: string; discriminator: string; id: string; avatar?: string } = {
    username: '',
    discriminator: '',
    id: '',
  };

  try {
    const [guildsRes, userRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    // 🔹 Falls Fetch fehlschlägt, Fehler loggen
    if (!guildsRes.ok) {
      console.error('Guilds fetch failed:', await guildsRes.text());
      throw new Error('Guilds fetch failed');
    }
    if (!userRes.ok) {
      console.error('User fetch failed:', await userRes.text());
      throw new Error('User fetch failed');
    }

    guilds = await guildsRes.json();
    user = await userRes.json();
  } catch (err) {
    console.error('DashboardPage error:', err);
    redirect('/?error=oauth');
  }

  return <DashboardClient guilds={guilds} user={user} />;
}
