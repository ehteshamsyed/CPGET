import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";

export default async function TeacherQuizzesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") redirect("/");

  const quizzes = await prisma.quiz.findMany({
    where: { teacherId: session.user.id },
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mock Tests</h1>
        <Link href="/dashboard/teacher/quizzes/new">
          <Button><Plus className="mr-2 h-4 w-4" /> New Mock Test</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader><CardTitle>{quiz.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{quiz._count.questions} Questions</p>
              <Link href={`/dashboard/teacher/quizzes/${quiz.id}`}>
                <Button variant="outline" className="w-full">View {quiz._count.attempts} Results</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}