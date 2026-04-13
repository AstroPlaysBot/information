// src/app/api/me/route.ts
// src/app/api/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Discord Snowflake → Account Creation Date
function getDiscordCreationDate(id: string) {
  const discordEpoch = 1420070400000;
  return new Date(Number(BigInt(id) >> 22n) + discordEpoch);
}

export async function GET() {
  const token = cookies().get('user_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const res = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await res.json();

    const accountCreated = getDiscordCreationDate(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        discriminator: user.discriminator,
        avatar: user.avatar,
        created_at: accountCreated, // 👈 wichtig
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
