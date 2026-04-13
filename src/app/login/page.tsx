export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
  const REDIRECT_URI = `${APP_URL}/api/discord-auth`;

  // 🔹 START OAuth
  if (!code) {
    const discordLogin = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=identify`;

    return NextResponse.redirect(discordLogin);
  }

  // 🔹 TOKEN
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${APP_URL}/login`);
  }

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const user = await userRes.json();

  if (!user?.id) {
    return NextResponse.redirect(`${APP_URL}/login`);
  }

  const response = NextResponse.redirect(`${APP_URL}/`);

  response.cookies.set('user_token', tokenData.access_token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}
