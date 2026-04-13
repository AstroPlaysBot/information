import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.discordId) {
    return NextResponse.json({ success:false, error:"Missing data" });
  }

  const memberCheck = await prisma.adminBoardMember.findUnique({
    where: { discordId: body.discordId }
  });

  if(!memberCheck){
    return NextResponse.json({ success:false, error:"User nicht gefunden" });
  }

  const now = new Date();

  try {

    // 🔥 1. EXIT QUEUE (48h freeze FIXED)
    await prisma.adminExitQueue.upsert({
      where: { discordId: body.discordId },
      update: {
        deleteAt: new Date(now.getTime() + 48 * 60 * 60 * 1000)
      },
      create: {
        discordId: body.discordId,
        deleteAt: new Date(now.getTime() + 48 * 60 * 60 * 1000)
      }
    });

    // 🔥 2. APPLICATION BAN (30 Tage)
    await prisma.applicationBan.upsert({
      where: { discordId: body.discordId },
      update: {
        bannedUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      },
      create: {
        discordId: body.discordId,
        bannedUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    // 🔥 3. DB UPDATE (UNCHANGED)
    await prisma.adminBoardMember.update({
      where: { discordId: body.discordId },
      data: {
        updatedAt: new Date(),
        resignationReason: body.reasonType || null,
        resignationText: body.reasonText || null
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const nowString = new Date().toLocaleString("de-DE");

    await transporter.sendMail({
      from: `"Team AstroPlays" <${process.env.SMTP_USER}>`,
      to: `${memberCheck.discordName}@discord.com`,
      subject: "Bestätigung deiner Kündigung im AdminBoard",
      html: `
        <div style="font-family:sans-serif; line-height:1.6; color:#111">
          <h2 style="color:#ef4444;">Hallo ${memberCheck.discordName},</h2>
          <p>deine Kündigung wurde verarbeitet.</p>
          <p><strong>Zeitpunkt:</strong> ${nowString}</p>
          <p>48h Admin-Daten Löschung aktiv.</p>
          <p>30 Tage Bewerbungssperre aktiv.</p>
        </div>
      `,
    });

  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ success:false });
  }

  return NextResponse.json({ success: true });
}
