import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET: For students to see upcoming classes
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const classes = await prisma.liveClass.findMany({
    where: {
      scheduledAt: {
        gte: new Date(), // Only show classes happening now or in the future
      },
    },
    orderBy: { scheduledAt: "asc" },
  })

  return NextResponse.json(classes)
}

// POST: For teacher to create a class
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { topic, description, scheduledAt, meetingLink } = await req.json()

    const newClass = await prisma.liveClass.create({
      data: {
        topic,
        description,
        scheduledAt: new Date(scheduledAt),
        meetingLink,
        teacherId: session.user.id,
      },
    })

    return NextResponse.json(newClass)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}