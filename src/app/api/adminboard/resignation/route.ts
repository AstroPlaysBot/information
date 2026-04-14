import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { discordId, reasonType, reasonText, email } = body;

    if (!discordId) {
      return NextResponse.json({ success: false });
    }

    const member = await prisma.adminBoardMember.findUnique({
      where: { discordId }
    });

    if (!member) {
      return NextResponse.json({ success: false });
    }

    const revokeToken = crypto.randomBytes(32).toString("hex");

    // SAVE RESIGNATION
    await prisma.adminBoardResignation.create({
      data: {
        discordId,
        discordName: member.discordName,
        reasonType,
        reasonText,
        revokeToken
      }
    });

    // SET STATUS (NO DELETE!)
    await prisma.adminBoardMember.update({
      where: { discordId },
      data: {
        status: "RESIGNED",
        resignedAt: new Date()
      }
    });

    const revokeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard/resignation/revoke?token=${revokeToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (email) {
      await transporter.sendMail({
        from: `"AdminBoard" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Kündigung bestätigt",
        html: `
          <h2>Deine Kündigung wurde verarbeitet</h2>

          <p><b>${member.discordName}</b></p>

          <p>Grund: ${reasonType || "-"}</p>
          <p>${reasonText || "-"}</p>

          <p>Du hast 48h Zeit zum Widerruf:</p>

          <a href="${revokeUrl}">
            Kündigung widerrufen
          </a>
        `
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
