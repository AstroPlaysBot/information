import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.note) {
      return NextResponse.json(
        { error: "Fehlende Daten: id oder note" },
        { status: 400 }
      );
    }

    // 🔥 ONLY ADMIN TOKEN
    const cookie = req.headers.get("cookie") || "";

    const getCookie = (name: string) =>
      cookie
        .split(`${name}=`)[1]
        ?.split(";")[0];

    const token = getCookie("admin_token");

    // ❌ USER IST HIER KOMPLETT UNGÜLTIG
    if (!token) {
      return NextResponse.json(
        { error: "Nur Admins erlaubt" },
        { status: 401 }
      );
    }

    // Discord verify
    const discordRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!discordRes.ok) {
      return NextResponse.json(
        { error: "Discord Auth fehlgeschlagen" },
        { status: 401 }
      );
    }

    const discordUser = await discordRes.json();

    const displayName =
      discordUser.global_name ||
      discordUser.username;

    const app = await prisma.application.findUnique({
      where: { id: body.id },
    });

    if (!app) {
      return NextResponse.json(
        { error: "Bewerbung nicht gefunden" },
        { status: 404 }
      );
    }

    const notes = Array.isArray(app.notes) ? app.notes : [];

    const newNote = {
      text: body.note,
      author: displayName,
      date: new Date().toISOString(),
    };

    await prisma.application.update({
      where: { id: body.id },
      data: {
        notes: [...notes, newNote],
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Error saving note:", err);

    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
