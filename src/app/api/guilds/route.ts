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

    if (!token) {
      return NextResponse.json(
        { error: "Nicht eingeloggt" },
        { status: 401 }
      );
    }

    const BOT_ID = process.env.DISCORD_BOT_ID!;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
    if (!BOT_ID || !BOT_TOKEN) {
      throw new Error("Bot ID oder Token fehlt");
    }

    // 1️⃣ User Info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await userRes.json();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Discord User Fehler" },
        { status: 500 }
      );
    }
    const userId = user.id;

    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: { username: user.username, avatar: user.avatar ?? null },
      create: { discordId: userId, username: user.username, avatar: user.avatar ?? null },
    });

    // 2️⃣ User Guilds
    const guildRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userGuilds = await guildRes.json();
    if (!Array.isArray(userGuilds)) return NextResponse.json({ guilds: [] });

    const result: { id: string; name: string; icon?: string; role: RoleType }[] = [];

    // 3️⃣ Loop über User-Guilds
    for (const g of userGuilds) {
      // Prüfen ob Bot Mitglied ist
      const botCheck = await fetch(
        `https://discord.com/api/guilds/${g.id}/members/${BOT_ID}`,
        { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
      );
      if (botCheck.status !== 200) continue; // Bot ist nicht im Server

      // Prisma Server Upsert
      await prisma.server.upsert({
        where: { id: g.id },
        update: { name: g.name, icon: g.icon ?? null },
        create: { id: g.id, name: g.name, icon: g.icon ?? null, ownerId: g.owner ? userId : userId },
      });

      let role: RoleType | null = null;

      // Owner prüfen
      if (g.owner) {
        role = "OWNER";
        await prisma.serverUser.upsert({
          where: { serverId_userId: { serverId: g.id, userId } },
          update: { role: "OWNER" },
          create: { serverId: g.id, userId, role: "OWNER" },
        });
      } else {
        // Co-Owner / Partner aus DB
        const dbRole = await prisma.serverUser.findUnique({
          where: { serverId_userId: { serverId: g.id, userId } },
        });
        if (dbRole) role = dbRole.role as RoleType;
      }

      if (role) {
        result.push({ id: g.id, name: g.name, icon: g.icon, role });
      }
    }

    // 4️⃣ Sortieren nach Rolle: OWNER > CO_OWNER > PARTNER
    const priority: Record<RoleType, number> = { OWNER: 0, CO_OWNER: 1, PARTNER: 2 };
    result.sort((a, b) => priority[a.role] - priority[b.role]);

    return NextResponse.json({ guilds: result });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
