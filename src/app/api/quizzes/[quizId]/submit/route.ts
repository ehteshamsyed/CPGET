import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { quizId } = await params;

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers } = await req.json(); // answers format: { "questionId": "A", ... }
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    // Scoring Logic
    let score = 0;
    quiz.questions.forEach((q) => {
      // Compare the student's chosen letter directly with the database answer letter
      if (answers[q.id] === q.answer) {
        score++;
      }
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        score,
        quizId,
        studentId: session.user.id,
      },
    });

    return NextResponse.json({ score, total: quiz.questions.length, attemptId: attempt.id });
  } catch (error) {
    console.error("SUBMISSION_ERROR:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}