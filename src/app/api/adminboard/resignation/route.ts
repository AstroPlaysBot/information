import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { discordId, reasonType, reasonText } = body

    if (!discordId) {
      return NextResponse.json({ error: "Missing discordId" }, { status: 400 })
    }

    // AdminBoard Member holen
    const member = await prisma.adminBoardMember.findUnique({
      where: { discordId }
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Kündigung speichern
    await prisma.adminBoardResignation.create({
      data: {
        discordId,
        discordName: member.discordName,
        reasonType,
        reasonText
      }
    })

    // aus AdminBoard entfernen
    await prisma.adminBoardMember.delete({
      where: { discordId }
    })

    // Email senden (wenn Email vorhanden)
    if (reasonText !== undefined) {
      try {
        await resend.emails.send({
          from: "AdminBoard <noreply@deinedomain.de>",
          to: "user@example.com",
          subject: "Bestätigung deiner AdminBoard Kündigung",
          html: `
          <h2>Kündigung bestätigt</h2>

          <p>Hallo ${member.discordName},</p>

          <p>deine Kündigung aus dem AdminBoard wurde erfolgreich eingereicht.</p>

          <p><strong>Grund:</strong> ${reasonType || "Kein Grund angegeben"}</p>

          <p><strong>Feedback:</strong> ${reasonText || "Kein Feedback"}</p>

          <br/>

          <p>Deine personenbezogenen Daten werden innerhalb von <b>48 Stunden</b> gelöscht.</p>

          <p>Innerhalb dieser Zeit kannst du deine Kündigung noch widerrufen.</p>

          <br/>

          <p>Mit freundlichen Grüßen<br/>AdminBoard System</p>
          `
        })
      } catch (mailError) {
        console.error("Mail error:", mailError)
      }
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
