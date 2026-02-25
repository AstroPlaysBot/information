import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  roleLabel?: 'Eigentümer' | 'Anteilhaber';
  roleColor?: 'green' | 'orange';
}

export default async function DashboardPage({ searchParams }: { searchParams?: { token?: string } }) {
  const BOT_ID = '1462897111166095412'; // deine Bot-ID

  let token = cookies().get('discord_token')?.value;
  if (!token && searchParams?.token) token = searchParams.token;

  if (!token) redirect('/api/discord-auth?state=dashboard');

  let guilds: Guild[] = [];
  let user: { username: string; discriminator: string; id: string; avatar?: string } = {
    username: '',
    discriminator: '',
    id: '',
  };

  try {
    const [guildsRes, userRes, dbUsersRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard-users`),
    ]);

    if (!guildsRes.ok) throw new Error(await guildsRes.text());
    if (!userRes.ok) throw new Error(await userRes.text());
    if (!dbUsersRes.ok) throw new Error('DB Users fetch failed');

    const allGuilds = await guildsRes.json();
    user = await userRes.json();
    const dbUsers: { discordId: string }[] = await dbUsersRes.json();

    // 🔹 Filter: nur Server mit Bot
    guilds = allGuilds
      .filter((g: any) => g.members?.some((m: any) => m.id === BOT_ID) || g.owner || dbUsers.some(u => u.discordId === g.id))
      .map((g: any) => {
        if (g.owner) return { ...g, roleLabel: 'Eigentümer', roleColor: 'green' };
        if (dbUsers.some(u => u.discordId === g.id)) return { ...g, roleLabel: 'Anteilhaber', roleColor: 'orange' };
        return g;
      });
  } catch (err) {
    console.error('DashboardPage error:', err);
    redirect('/?error=oauth');
  }

  return <DashboardClient guilds={guilds} user={user} />;
}
