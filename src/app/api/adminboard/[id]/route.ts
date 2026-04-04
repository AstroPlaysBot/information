import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

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
      notes: true, // <- unbedingt
    }
  })

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    )
  }

  // fallback: leeres Array, wenn notes null ist
  if (!application.notes) application.notes = []

  return NextResponse.json(application)

}
