// src/app/adminboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_GUILD_ID = process.env.ADMIN_GUILD_ID!;
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

export default async function AdminboardPage() {
  const token = cookies().get('discord_token')?.value;
  if (!token) redirect('/');

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!userRes.ok) redirect('/');

  const user = await userRes.json();

  const memberRes = await fetch(
    `https://discord.com/api/guilds/${ADMIN_GUILD_ID}/members/${user.id}`,
    {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
      cache: 'no-store',
    }
  );

  if (!memberRes.ok) redirect('/');

  const member = await memberRes.json();

  if (!member.roles.includes(ADMIN_ROLE_ID)) {
    redirect('/');
  }

  return <div>Adminboard Inhalt</div>;
}
