// src/app/adminboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminboardClient from './AdminboardClient';

const GUILD_ID = '1462894776671277241';
const ROLE_ID = '1474507057154756919';

export default async function AdminboardPage() {
  const token = cookies().get('discord_token')?.value;
  if (!token) redirect('/');

  try {
    // 1️⃣ User holen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error('User fetch failed');
    const user = await userRes.json();

    // 2️⃣ Member in Guild holen (Bot Token!)
    const memberRes = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
    if (!memberRes.ok) throw new Error('Member fetch failed');
    const member = await memberRes.json();

    // 3️⃣ Role check
    const hasRole = member.roles.includes(ROLE_ID);
    if (!hasRole) redirect('/');

    // 4️⃣ Bewerbungen laden
    const appsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
      cache: 'no-store',
    });
    const appsData = await appsRes.json();
    const applications = appsData?.applications || [];

    return <AdminboardClient applications={applications} />;
  } catch (err) {
    console.error(err);
    redirect('/');
  }
}
