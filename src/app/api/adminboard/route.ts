import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      where: {
        deleted: false, // Papierkorb ausblenden
      },
      orderBy: [
        { role: "asc" },       // zuerst nach Position sortieren
        { submittedAt: "desc"} // danach nach Datum
      ],
    });

    return NextResponse.json({ applications });

  } catch (error) {
    console.error("Adminboard GET Fehler:", error);

    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const application = await prisma.application.create({
      data: {
        name: body.name,
        role: body.role,
        age: body.age,
        email: body.email,
        answers: body.answers ?? {},

        discord_id: body.discordId,
        discriminator: body.discriminator,
        avatar: body.avatar,

        account_created: body.accountCreated
          ? new Date(body.accountCreated)
          : null,

        status: "PENDING",
        deleted: false
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });

  } catch (error) {
    console.error("Adminboard POST Fehler:", error);

    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500 }
    );
  }
}
