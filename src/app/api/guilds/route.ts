import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export type RoleType = "OWNER" | "CO_OWNER" | "PARTNER";

export async function GET() {
  try {

    const cookieStore = cookies();
    const token =
      cookieStore.get("admin_token")?.value ||
      cookieStore.get("user_token")?.value;

    if (!token)
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

    // USER
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await userRes.json();
    const userId = user.id;

    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: {
        username: user.username,
        avatar: user.avatar,
      },
      create: {
        discordId: userId,
        username: user.username,
        avatar: user.avatar,
      },
    });

    // USER GUILDS
    const guildRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userGuilds = await guildRes.json();

    // BOT GUILDS
    const botRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    const botGuilds = await botRes.json();
    const botGuildIds = new Set(botGuilds.map((g: any) => g.id));

    const result: any[] = [];

    for (const g of userGuilds) {

      // Bot muss im Server sein
      if (!botGuildIds.has(g.id)) continue;

      await prisma.server.upsert({
        where: { id: g.id },
        update: {
          name: g.name,
          icon: g.icon ?? null,
          ownerId: g.owner ? userId : undefined,
        },
        create: {
          id: g.id,
          name: g.name,
          icon: g.icon ?? null,
          ownerId: userId,
        },
      });

      let role: RoleType | null = null;

      // OWNER
      if (g.owner) {
        role = "OWNER";

        await prisma.serverUser.upsert({
          where: {
            serverId_userId: {
              serverId: g.id,
              userId: userId,
            },
          },
          update: { role: "OWNER" },
          create: {
            serverId: g.id,
            userId: userId,
            role: "OWNER",
          },
        });

      } else {

        const dbRole = await prisma.serverUser.findUnique({
          where: {
            serverId_userId: {
              serverId: g.id,
              userId: userId,
            },
          },
        });

        if (dbRole) role = dbRole.role as RoleType;

      }

      if (role) {
        result.push({
          id: g.id,
          name: g.name,
          icon: g.icon,
          role,
        });
      }

    }

    const priority: Record<RoleType, number> = {
      OWNER: 0,
      CO_OWNER: 1,
      PARTNER: 2,
    };

    result.sort((a, b) => priority[a.role] - priority[b.role]);

    return NextResponse.json({ guilds: result });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500 }
    );

  }
}
