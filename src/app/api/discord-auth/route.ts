import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

  if (!code) return NextResponse.redirect("/");

  // Token von Discord holen
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      scope: "identify guilds",
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Discord User Daten holen
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userData = await userRes.json();

  // Redirect zurück auf Frontend mit Query-Parametern
  const redirect = new URL("/", req.url);
  redirect.searchParams.set("access_token", accessToken);
  redirect.searchParams.set("discord_user_id", userData.id);

  return NextResponse.redirect(redirect);
}
