// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { MAINTENANCE_MODE } from '@/config/maintenance';

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
  // ✅ Serverseitig Token holen
  const token = cookies().get('discord_token')?.value;

  // 🔹 Kein Token → OAuth starten
  if (!token) {
    redirect('/api/discord-auth?state=dashboard');
  }

  let guilds: Guild[] = [];
  let user = { username: '', discriminator: '', id: '', avatar: undefined };

  try {
    const [guildsRes, userRes, dbUsersRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store', // Server-side caching ausschalten
      }),
      fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard-users`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
    ]);

    // 🔹 Token invalid → OAuth erneut
    if (guildsRes.status === 401 || userRes.status === 401) {
      redirect('/api/discord-auth?state=dashboard');
    }

    if (!guildsRes.ok) console.error('Guilds fetch failed', await guildsRes.text());
    if (!userRes.ok) console.error('User fetch failed', await userRes.text());
    if (!dbUsersRes.ok) console.error('DB fetch failed', dbUsersRes.status);

    if (MAINTENANCE_MODE) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white bg-black">
          <div className="bg-yellow-600 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Dashboard Wartungsmodus</h2>
            <p>Dashboard Funktionen aktuell nicht erreichbar.</p>
            <p className="mt-2">
              Mehr Infos auf Discord: 
              <a href="https://discord.gg/3cvhBBm87G" className="underline ml-1">Hier klicken</a>
            </p>
          </div>
        </div>
      );
    }
    
    const allGuilds = await guildsRes.json();
    user = await userRes.json();
    const dbUsers: { discordId: string }[] = await dbUsersRes.json();

    guilds = allGuilds
      .filter((g: any) => g.owner || dbUsers.some(u => u.discordId === g.id))
      .map((g: any) => {
        if (g.owner) return { ...g, roleLabel: 'Eigentümer', roleColor: 'green' };
        if (dbUsers.some(u => u.discordId === g.id)) return { ...g, roleLabel: 'Anteilhaber', roleColor: 'orange' };
        return g;
      });
  } catch (err) {
    console.error('DashboardPage unexpected error', err);
    // 🔹 Bei Fehler kein Redirect, sonst Loop
  }

  return <DashboardClient guilds={guilds} user={user} />;
}


