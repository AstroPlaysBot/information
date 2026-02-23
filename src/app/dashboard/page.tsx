// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GuildGrid from './GuildGrid';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default async function DashboardPage() {
  const token = cookies().get('discord_token')?.value;
  if (!token) redirect('/');

  let guilds: Guild[] = [];
  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token}` },
    });
    guilds = await res.json();
  } catch (err) {
    console.error(err);
    redirect('/?error=oauth');
  }

  return <GuildGrid guilds={guilds} />;
}
