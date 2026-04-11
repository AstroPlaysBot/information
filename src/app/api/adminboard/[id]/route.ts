import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        role: true,
        age: true,
        email: true,
        answers: true,
        status: true,
        interviewDate: true,
        interviewPlace: true,
        notes: true,
        oldInterviews: true,
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...application,
      notes: application.notes ?? [],
      oldInterviews: application.oldInterviews ?? []
    })

  } catch (err) {
    console.error("ADMINBOARD LOAD ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
