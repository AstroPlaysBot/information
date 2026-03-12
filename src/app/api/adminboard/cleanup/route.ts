import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){

  const limit = new Date()
  limit.setDate(limit.getDate()-30)

  await prisma.application.deleteMany({
    where:{
      deleted:true,
      deletedAt:{lt:limit}
    }
  })

  return NextResponse.json({success:true})

}
