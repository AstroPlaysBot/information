// src/app/api/discord-auth-apply/route.ts
import { handleDiscordOAuth } from "@/lib/discordOAuth";

export async function GET(req: Request) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

  return handleDiscordOAuth({
    req,
    redirectUri: `${APP_URL}/api/discord-auth-apply`,
    successRedirect: `${APP_URL}/apply`,
    failRedirect: `${APP_URL}/apply`,
    mode: "apply",
  });
}
