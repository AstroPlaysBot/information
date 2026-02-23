import { NextResponse } from 'next/server';

const GUILD_ID = '1462894776671277241';
const ROLE_ID = '1474507057154756919';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.log('DEBUG: Kein Authorization Header vorhanden');
    return NextResponse.json({ allowed: false }, { status: 401 });
  }

  const accessToken = authHeader.replace('Bearer ', '');

  try {
    // 🔹 1️⃣ User holen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      console.error('DEBUG: User fetch failed', userRes.status, await userRes.text());
      throw new Error('User fetch failed');
    }

    const user = await userRes.json();
    console.log('DEBUG: User fetched:', user);

    // 🔹 2️⃣ Member in Guild holen (Bot Token!)
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!memberRes.ok) {
      console.error('DEBUG: Member fetch failed', memberRes.status, await memberRes.text());
      return NextResponse.json({ allowed: false });
    }

    const member = await memberRes.json();

    // 🔹 3️⃣ Debug Rollen
    console.log('DEBUG: Member fetched:', member);
    console.log('DEBUG: Roles array:', member.roles);

    // 🔹 4️⃣ Role check
    const hasRole = member.roles.includes(ROLE_ID);
    console.log('DEBUG: Has admin role?', hasRole);

    return NextResponse.json({ allowed: hasRole });
  } catch (err) {
    console.error('DEBUG: Admin check error', err);
    return NextResponse.json({ allowed: false }, { status: 500 });
  }
}
