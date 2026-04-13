import { handleDiscordAuth } from "@/lib/discordOAuth";

export async function GET(req: Request) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

  return handleDiscordAuth({
    req,
    redirectSuccess: `${APP_URL}/apply`,
    redirectFail: `${APP_URL}/apply`,
  });
}
