// src/app/login/page.tsx
import LoginButtons from './LoginButtons';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_GUILD_ID = process.env.ADMIN_GUILD_ID!;
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

export default async function LoginPage() {
  try {
    // 🔹 Server-side: Cookie auslesen
    const token = cookies().get('discord_token')?.value;

    if (!token) {
      return <LoginButtons isUser={false} isAdmin={false} username={null} />;
    }

    // 🔹 User-Daten von Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      return <LoginButtons isUser={false} isAdmin={false} username={null} />;
    }

    const user = await userRes.json();

    // 🔹 Admin Check
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${ADMIN_GUILD_ID}/members/${user.id}`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    );

    const member = memberRes.ok ? await memberRes.json() : { roles: [] };
    const isAdmin = Array.isArray(member.roles) && member.roles.includes(ADMIN_ROLE_ID);

    return (
      <LoginButtons
        isUser={true}
        isAdmin={isAdmin}
        username={user.username}
      />
    );
  } catch (err) {
    console.error('LoginPage server error:', err);
    return <LoginButtons isUser={false} isAdmin={false} username={null} />;
  }
}
