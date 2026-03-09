import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function QuizDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params; // ✅ Must await params in Next.js 15+

  if (!session || session.user.role !== "TEACHER") redirect("/");

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      attempts: {
        include: { student: true },
        orderBy: { score: "desc" }
      },
      _count: { select: { questions: true } }
    }
  });

  if (!quiz) notFound();

  return (
    <div className="p-8 space-y-6">
      <Link href="/dashboard/teacher/quizzes">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to mock Tests
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
        <p className="text-muted-foreground">Student Performance Overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Attempts</p>
          <p className="text-2xl font-bold">{quiz.attempts.length}</p>
        </div>
        <div className="p-4 bg-slate-50 border rounded-lg">
          <p className="text-sm text-slate-500 font-medium">Questions</p>
          <p className="text-2xl font-bold">{quiz._count.questions}</p>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead className="text-right">Date Taken</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quiz.attempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell className="font-medium">{attempt.student.name}</TableCell>
                <TableCell className="text-slate-500">{attempt.student.email}</TableCell>
                <TableCell className="font-bold">{attempt.score} / {quiz._count.questions}</TableCell>
                <TableCell>
                   <span className={attempt.score / quiz._count.questions >= 0.5 ? "text-green-600" : "text-red-600"}>
                    {((attempt.score / quiz._count.questions) * 100).toFixed(0)}%
                   </span>
                </TableCell>
                <TableCell className="text-right text-slate-400">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {quiz.attempts.length === 0 && (
          <div className="text-center py-10 text-slate-500">No students have taken this mock test yet.</div>
        )}
      </div>
    </div>
  );
}