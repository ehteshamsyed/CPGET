import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // 1. Safety Check: Is the user logged in and a teacher?
    if (!session?.user?.id || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 })
    }

    const { title, description, questions } = await req.json()

    // 2. Validate input
    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: "Title and questions are required" }, { status: 400 })
    }

    // 3. Create the Quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        // Using 'connect' ensures Prisma links to the existing User ID
        teacher: {
          connect: { id: session.user.id }
        },
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            answer: q.answer,
          }))
        }
      }
    })

    return NextResponse.json(quiz)
  } catch (error: any) {
    console.error("QUIZ_CREATE_ERROR:", error)
    return NextResponse.json(
      { error: "Failed to create quiz. Check if all fields are filled." }, 
      { status: 500 }
    )
  }
}