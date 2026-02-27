// src/app/login/page.tsx
import LoginButtons from './LoginButtons';
import { cookies } from 'next/headers';

const ADMIN_GUILD_ID = process.env.ADMIN_GUILD_ID!;
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

export default async function LoginPage() {
  try {
    const token = cookies().get('discord_token')?.value;

    if (!token) {
      // ✅ TypeScript-konform: username=undefined
      return <LoginButtons isUser={false} isAdmin={false} username={undefined} />;
    }

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      return <LoginButtons isUser={false} isAdmin={false} username={undefined} />;
    }

    const user = await userRes.json();

    const memberRes = await fetch(
      `https://discord.com/api/guilds/${ADMIN_GUILD_ID}/members/${user.id}`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    );

    const member = memberRes.ok ? await memberRes.json() : { roles: [] };
    const isAdmin = Array.isArray(member.roles) && member.roles.includes(ADMIN_ROLE_ID);

    return <LoginButtons isUser={true} isAdmin={isAdmin} username={user.username} />;
  } catch (err) {
    console.error('LoginPage server error:', err);
    return <LoginButtons isUser={false} isAdmin={false} username={undefined} />;
  }
}
