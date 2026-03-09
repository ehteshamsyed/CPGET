import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const announcement = await prisma.announcement.findUnique({
    where: { id: "GLOBAL" },
    include: { teacher: { select: { name: true, email: true } } },
  })

  return NextResponse.json(announcement)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content } = await req.json()

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Title and content required" },
      { status: 400 }
    )
  }

  const announcement = await prisma.announcement.upsert({
    where: { id: "GLOBAL" },
    update: {
      title,
      content,
      teacherId: session.user.id, // ✅ IMPORTANT
    },
    create: {
      id: "GLOBAL",
      title,
      content,
      teacherId: session.user.id, // ✅ IMPORTANT
    },
  })

  return NextResponse.json(announcement)
}

export async function DELETE() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.announcement.delete({
    where: { id: "GLOBAL" },
  }).catch(() => {})

  return NextResponse.json({ message: "Deleted" })
}