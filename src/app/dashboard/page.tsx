// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const token = cookies().get('discord_token')?.value;

  // 🔹 Kein Token → OAuth starten
  if (!token) redirect('/api/discord-auth?state=dashboard');

  // Default Props
  let guilds: any[] = [];
  let user = { username: '', discriminator: '', id: '', avatar: undefined };

  try {
    // 🔹 User
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!userRes.ok) redirect('/api/discord-auth?state=dashboard');
    user = await userRes.json();

    // 🔹 Guilds
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
    // ⚠ Props immer noch gültig zurückgeben
  }

  // 🔹 Immer Client Component rendern
  return <DashboardClient guilds={guilds} user={user} />;
}
