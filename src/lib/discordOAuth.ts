import { NextResponse } from "next/server";

const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";

export async function handleDiscordAuth({
  req,
  redirectSuccess,
  redirectFail,
}: {
  req: Request;
  redirectSuccess: string;
  redirectFail: string;
}) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

  if (!code) {
    return NextResponse.redirect(redirectFail);
  }

  const tokenRes = await fetch(DISCORD_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectFail,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(redirectFail);
  }

  const userRes = await fetch(DISCORD_USER_URL, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const user = await userRes.json();

  if (!user?.id) {
    return NextResponse.redirect(redirectFail);
  }

  const response = NextResponse.redirect(redirectSuccess);

  response.cookies.set("user_token", tokenData.access_token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
