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

export default async function DashboardPage() {
  const BOT_ID = '1462897111166095412';

  // 🔹 Server-seitiger Zugriff auf HTTP-only Cookie
  const token = cookies().get('discord_token')?.value;
  if (!token) {
    // Kein Token → OAuth starten
    redirect('/api/discord-auth?state=dashboard');
  }

  let guilds: Guild[] = [];
  let user: { username: string; discriminator: string; id: string; avatar?: string } = {
    username: '',
    discriminator: '',
    id: '',
  };

  try {
    // 🔹 Alle Daten parallel holen
    const [guildsRes, userRes, dbUsersRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 }, // immer frische Daten
      }),
      fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard-users`, {
        headers: { Authorization: `Bearer ${token}` }, // Token direkt weitergeben
        next: { revalidate: 0 },
      }),
    ]);

    if (!guildsRes.ok || !userRes.ok || !dbUsersRes.ok) {
      console.error(
        'Fetch error:',
        await guildsRes.text(),
        await userRes.text(),
        dbUsersRes.status
      );
      redirect('/api/discord-auth?state=dashboard'); // Token evtl. abgelaufen
    }

    const allGuilds = await guildsRes.json();
    user = await userRes.json();
    const dbUsers: { discordId: string }[] = await dbUsersRes.json();

    // 🔹 Filter: nur Server, die du verwaltest oder Besitzer bist
    guilds = allGuilds
      .filter((g: any) => g.owner || dbUsers.some(u => u.discordId === g.id))
      .map((g: any) => {
        if (g.owner) return { ...g, roleLabel: 'Eigentümer', roleColor: 'green' };
        if (dbUsers.some(u => u.discordId === g.id)) return { ...g, roleLabel: 'Anteilhaber', roleColor: 'orange' };
        return g;
      });
  } catch (err) {
    console.error('DashboardPage unexpected error:', err);
    redirect('/api/discord-auth?state=dashboard'); // Fallback OAuth
  }

  return <DashboardClient guilds={guilds} user={user} />;
}
