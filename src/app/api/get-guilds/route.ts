import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Kein AccessToken gesendet" }, { status: 400 });
    }

    // Discord API: User Guilds
    const res = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Discord API Fehler: ${text}` }, { status: res.status });
    }

    const data = await res.json();

    // Optional: nur Server, bei denen man Eigentümer ist
    const guilds = data.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      owner: g.owner,
    }));

    return NextResponse.json({ guilds });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Unbekannter Fehler" }, { status: 500 });
  }
}
