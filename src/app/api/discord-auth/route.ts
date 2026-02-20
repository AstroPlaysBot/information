import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

const MAIN_GUILD_ID = '1462894776671277241';
const ADMIN_ROLE_ID = '1474507057154756919';

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) {
    return NextResponse.json({ error: 'Code fehlt' }, { status: 400 });
  }

  /* ───────── TOKEN ───────── */
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    scope: 'identify guilds',
  });

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.json({ error: tokenData }, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  /* ───────── USER ───────── */
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await userRes.json();

  /* ───────── GUILDS ───────── */
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const guilds = await guildsRes.json();

  const isInMainGuild = guilds.some((g: any) => g.id === MAIN_GUILD_ID);

  /* ───────── MEMBER / ROLES ───────── */
  let roles: string[] = [];
  let isAdmin = false;

  if (isInMainGuild) {
    const memberRes = await fetch(
      `https://discord.com/api/users/@me/guilds/${MAIN_GUILD_ID}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (memberRes.ok) {
      const member = await memberRes.json();
      roles = member.roles ?? [];
      isAdmin = roles.includes(ADMIN_ROLE_ID);
    }
  }

  /* ───────── RESPONSE ───────── */
  return NextResponse.json({
    user,
    guilds,
    permissions: {
      isInMainGuild,
      isAdmin,
      roles,
    },
  });
}
