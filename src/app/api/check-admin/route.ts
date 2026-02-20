// api/check-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';

// IDs von deinem Discord-Server und Admin-Rolle
const MAIN_GUILD_ID = '1462894776671277241';
const ADMIN_ROLE_ID = '1474507057154756919';

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Kein Access Token' }, { status: 400 });
    }

    // Discord API: Member vom Server abrufen
    const memberRes = await fetch(
      `https://discord.com/api/users/@me/guilds/${MAIN_GUILD_ID}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!memberRes.ok) {
      return NextResponse.json({ isAdmin: false });
    }

    const member = await memberRes.json();

    const isAdmin = member.roles.includes(ADMIN_ROLE_ID);

    return NextResponse.json({ isAdmin });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ isAdmin: false });
  }
}
