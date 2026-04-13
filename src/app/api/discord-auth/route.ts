// src/app/api/discord-auth/route.ts
import { handleDiscordOAuth } from "@/lib/discordOAuth";

export async function GET(req: Request) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

  return handleDiscordOAuth({
    req,
    redirectUri: `${APP_URL}/api/discord-auth`,
    successRedirect: `${APP_URL}/`,
    failRedirect: `${APP_URL}/login`,
    mode: "login",
  });
}
