// src/app/login/page.tsx
import LoginButtons from './LoginButtons';
import { cookies } from 'next/headers';

// 🔹 Dynamic rendering erzwingen
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const ADMIN_GUILD_ID = process.env.ADMIN_GUILD_ID;
  const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID;
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  if (!ADMIN_GUILD_ID || !ADMIN_ROLE_ID || !BOT_TOKEN) {
    throw new Error('Admin environment variables not set');
  }

  const cookieStore = cookies();
  const token = cookieStore.get('discord_token')?.value;

  let isUser = false;
  let isAdmin = false;
  let username = '';

  if (token) {
    try {
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRes.ok) {
        const user = await userRes.json();
        username = user.username;
        isUser = true;

        // Admin Check
        const memberRes = await fetch(
          `https://discord.com/api/guilds/${ADMIN_GUILD_ID}/members/${user.id}`,
          { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
        );

        if (memberRes.ok) {
          const member = await memberRes.json();
          isAdmin = Array.isArray(member.roles) && member.roles.includes(ADMIN_ROLE_ID);
        }
      }
    } catch (err) {
      console.error('LoginPage server error:', err);
    }
  }

  return <LoginButtons isUser={isUser} isAdmin={isAdmin} username={username} />;
}
