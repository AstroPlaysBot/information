// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('discord_token')?.value;

  if (!token) return redirect('/api/discord-auth?state=/dashboard');

  let guilds: any[] = [];
  let user = { username: '', discriminator: '', id: '', avatar: undefined };

  try {
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!userRes.ok) return redirect('/api/discord-auth?state=/dashboard');
    user = await userRes.json();

    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (guildsRes.ok) {
      const allGuilds = await guildsRes.json();
      guilds = allGuilds.map((g: any) => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        owner: g.owner,
      }));
    }
  } catch (err) {
    console.error('DashboardPage error:', err);
  }

  return <DashboardClient guilds={guilds} user={user} />;
}
