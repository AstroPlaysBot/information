// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const token = cookies().get('discord_token')?.value;

  // 🔹 Kein Token → sofort redirect (Server Component, okay)
  if (!token) {
    redirect('/api/discord-auth?state=dashboard');
  }

  let guilds: any[] = [];
  let user = { username: '', discriminator: '', id: '', avatar: undefined };

  try {
    const [userRes, guildsRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
    ]);

    // 🔹 Token ungültig → redirect
    if (!userRes.ok || !guildsRes.ok) {
      redirect('/api/discord-auth?state=dashboard');
    }

    user = await userRes.json();
    const allGuilds = await guildsRes.json();

    guilds = allGuilds.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      owner: g.owner,
    }));

  } catch (err) {
    console.error('DashboardPage fetch error', err);
    // Optional: hier Redirect oder Fehlerseite anzeigen
  }

  // ⚡ Props an Client Component weitergeben
  return <DashboardClient guilds={guilds} user={user} />;
}
