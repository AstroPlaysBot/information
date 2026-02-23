import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

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

    guilds = await guildsRes.json();
    user = await userRes.json();
  } catch (err) {
    console.error(err);
    redirect('/?error=oauth');
  }

  return <DashboardClient guilds={guilds} user={user} />;
}
