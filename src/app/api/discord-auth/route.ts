import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // dashboard oder adminboard

  if (!code) return NextResponse.redirect(`${APP_URL}/login?error=no_code`);

  // 1️⃣ Token bei Discord holen
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${APP_URL}/api/discord-auth`);
  params.append('scope', 'identify guilds');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('Token Error:', tokenData);
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  // 2️⃣ User Infos abrufen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  let redirectPath = '/dashboard'; // default für normale Users

  // 3️⃣ Adminboard-Check
  if (state === 'adminboard') {
    const checkRes = await fetch(`${APP_URL}/api/admin-check`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const checkJson = await checkRes.json();
    if (checkJson.allowed) {
      redirectPath = '/adminboard'; // hat Rolle → Adminboard
    } else {
      redirectPath = '/'; // keine Rechte → Home
    }
  }

  // 4️⃣ Redirect
  return NextResponse.redirect(`${APP_URL}${redirectPath}`);
}
