import { NextResponse } from "next/server";
import { isAdmin } from "@/data/admins";

const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";

export async function handleDiscordOAuth({
  req,
  redirectUri,
  successRedirect,
  failRedirect,
  mode, // 👈 NEW
}: {
  req: Request;
  redirectUri: string;
  successRedirect: string;
  failRedirect: string;
  mode: "login" | "apply";
}) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;

    // 🔹 START
    if (!code) {
      const loginUrl = new URL("https://discord.com/oauth2/authorize");
      loginUrl.searchParams.set("client_id", CLIENT_ID);
      loginUrl.searchParams.set("response_type", "code");
      loginUrl.searchParams.set("redirect_uri", redirectUri);
      loginUrl.searchParams.set("scope", "identify");

      return NextResponse.redirect(loginUrl.toString());
    }

    // 🔹 TOKEN
    const tokenRes = await fetch(DISCORD_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(failRedirect);
    }

    // 🔹 USER
    const userRes = await fetch(DISCORD_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const user = await userRes.json();
    if (!user?.id) {
      return NextResponse.redirect(failRedirect);
    }

    // 🔐 ADMIN CHECK
    const admin = await isAdmin(user.id);

    const response = NextResponse.redirect(successRedirect);

    // 👤 USER TOKEN IMMER
    response.cookies.set("user_token", tokenData.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    // 👑 ADMIN TOKEN NUR WENN ADMIN
    if (admin) {
      response.cookies.set("admin_token", tokenData.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60,
        sameSite: "lax",
      });
    }

    return response;
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    return NextResponse.redirect(failRedirect);
  }
}
