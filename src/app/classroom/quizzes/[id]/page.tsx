import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import QuizPlayer from "./QuizPlayer";// We will create this client component

export default async function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) redirect("/login");

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });

  if (!quiz) notFound();

  // Check if already attempted
  const existingAttempt = await prisma.quizAttempt.findFirst({
    where: { quizId: id, studentId: session.user.id }
  });

  if (existingAttempt) redirect(`/classroom/quizzes/${id}/result`);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="text-muted-foreground">{quiz.description}</p>
      </div>
      
      {/* Passing data to a Client Component to handle selection and timer */}
      <QuizPlayer quiz={quiz} />
    </div>
  );
}