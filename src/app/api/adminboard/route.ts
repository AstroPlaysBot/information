// app/api/admin-check/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GUILD_ID = '1462894776671277241';
const ROLE_ID = '1474507057154756919';

export async function GET() {
  const token = cookies().get('discord_token')?.value;

  if (!token) {
    return NextResponse.json({ allowed: false }, { status: 401 });
  }

  try {
    // 1️⃣ Discord User
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) return NextResponse.json({ allowed: false }, { status: 401 });
    const user = await userRes.json();

    // 2️⃣ Guild Member (Bot Token)
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`,
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    );

    if (!memberRes.ok) return NextResponse.json({ allowed: false });
    const member = await memberRes.json();

    // 3️⃣ Role Check
    const hasRole = member.roles.includes(ROLE_ID);

    return NextResponse.json({ allowed: hasRole });
  } catch (err) {
    console.error('ADMIN CHECK ERROR:', err);
    return NextResponse.json({ allowed: false }, { status: 500 });
  }
}
