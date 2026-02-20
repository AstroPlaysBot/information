import { NextRequest, NextResponse } from "next/server";
import { fetchDiscordMember } from "@/lib/discordApi";

const ADMIN_ROLE_IDS = ['1474507057154756919'];
const MAIN_GUILD_ID = '1462894776671277241';

export async function POST(req: NextRequest) {
  const { accessToken, discordUserId } = await req.json();

  if (!accessToken || !discordUserId) return NextResponse.json({ isAdmin: false });

  const memberRes = await fetch(`https://discord.com/api/users/@me/guilds/${MAIN_GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!memberRes.ok) return NextResponse.json({ isAdmin: false });

  const member = await memberRes.json();
  const isAdmin = member.roles.some((role: string) => ADMIN_ROLE_IDS.includes(role));

  return NextResponse.json({ isAdmin });
}
