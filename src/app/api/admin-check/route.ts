import { NextResponse } from 'next/server';

const GUILD_ID = '1462894776671277241';
const ROLE_ID = '1474507057154756919';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ allowed: false }, { status: 401 });
  }

  const accessToken = authHeader.replace('Bearer ', '');

  try {
    // User holen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) throw new Error('User fetch failed');
    const user = await userRes.json();

    // Member in Guild holen (Bot Token!)
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!memberRes.ok) return NextResponse.json({ allowed: false });

    const member = await memberRes.json();
    const hasRole = member.roles.includes(ROLE_ID);

    return NextResponse.json({ allowed: hasRole });
  } catch (err) {
    return NextResponse.json({ allowed: false }, { status: 500 });
  }
}
