// app/api/admin-check/route.ts
import { NextResponse } from 'next/server';

const GUILD_ID = '1462894776671277241';
const ROLE_ID = '1474507057154756919';

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.match(/discord_token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ allowed: false }, { status: 401 });

  // User
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return NextResponse.json({ allowed: false });

  const user = await userRes.json();

  // Member
  const memberRes = await fetch(
    `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`,
    { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
  );

  if (!memberRes.ok) return NextResponse.json({ allowed: false });

  const member = await memberRes.json();
  const hasRole = member.roles.includes(ROLE_ID);

  return NextResponse.json({ allowed: hasRole });
}
