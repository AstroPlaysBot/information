import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const application = await prisma.application.findUnique({
    where: { id: params.id }
  })

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(application)

}
