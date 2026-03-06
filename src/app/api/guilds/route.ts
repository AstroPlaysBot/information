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
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    // --------------------
    // 1️⃣ USER INFO
    // --------------------
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      const text = await userRes.text();
      console.error("Discord User API Fehler:", userRes.status, text);
      return NextResponse.json(
        { error: `Discord User API Fehler: ${userRes.status}` },
        { status: 500 }
      );
    }

    const user = await userRes.json();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Discord User konnte nicht geladen werden" },
        { status: 500 }
      );
    }

    const userId = user.id;

    // DashboardUser upsert
    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: { username: user.username, avatar: user.avatar ?? null },
      create: { discordId: userId, username: user.username, avatar: user.avatar ?? null },
    });

    // --------------------
    // 2️⃣ USER GUILDS
    // --------------------
    const guildRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!guildRes.ok) {
      const text = await guildRes.text();
      console.error("Discord User Guilds API Fehler:", guildRes.status, text);
      return NextResponse.json(
        { error: `Discord User Guilds API Fehler: ${guildRes.status}` },
        { status: 500 }
      );
    }

    const userGuilds = await guildRes.json();
    if (!Array.isArray(userGuilds)) {
      return NextResponse.json({ guilds: [] });
    }

    // --------------------
    // 3️⃣ BOT CHECK & SERVER SYNC
    // --------------------
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const BOT_ID = process.env.DISCORD_BOT_ID;
    if (!BOT_TOKEN || !BOT_ID) {
      return NextResponse.json(
        { error: "Bot Token oder Bot ID fehlt" },
        { status: 500 }
      );
    }

    const result: { id: string; name: string; icon?: string; role: RoleType }[] = [];

    for (const g of userGuilds) {
      // Prüfe, ob Bot Mitglied ist
      const botCheck = await fetch(
        `https://discord.com/api/guilds/${g.id}/members/${BOT_ID}`,
        { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
      );

      if (!botCheck.ok) {
        // Bot ist nicht auf diesem Server
        console.warn(`Bot ist nicht Mitglied auf Guild ${g.id}, überspringe`);
        continue;
      }

      // Server in DB upsert
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

      // OWNER prüfen
      if (g.owner) {
        role = "OWNER";
        await prisma.serverUser.upsert({
          where: { serverId_userId: { serverId: g.id, userId } },
          update: { role: "OWNER" },
          create: { serverId: g.id, userId, role: "OWNER" },
        });
      } else {
        // CO_OWNER / PARTNER aus DB
        const dbRole = await prisma.serverUser.findUnique({
          where: { serverId_userId: { serverId: g.id, userId } },
        });
        if (dbRole) role = dbRole.role as RoleType;
      }

      if (role) {
        result.push({ id: g.id, name: g.name, icon: g.icon, role });
      }
    }

    // --------------------
    // 4️⃣ SORTIEREN
    // --------------------
    const priority: Record<RoleType, number> = { OWNER: 0, CO_OWNER: 1, PARTNER: 2 };
    result.sort((a, b) => priority[a.role] - priority[b.role]);

    return NextResponse.json({ guilds: result });
  } catch (err: any) {
    console.error("Server Route Fehler:", err);
    return NextResponse.json({ error: err.message || "Serverfehler" }, { status: 500 });
  }
}
