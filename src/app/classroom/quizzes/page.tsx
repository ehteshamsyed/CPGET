import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function StudentQuizzes() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  // Fetch quizzes and check if the student has already attempted them
  const quizzes = await prisma.quiz.findMany({
    include: {
      attempts: {
        where: { studentId: session.user.id }
      },
      _count: { select: { questions: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Available Quizzes</h1>
        <p className="text-muted-foreground">Test your knowledge on Nutrition</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const isAttempted = quiz.attempts.length > 0
          
          return (
            <Card key={quiz.id} className={isAttempted ? "bg-slate-50 opacity-80" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  {quiz.title}
                  {isAttempted && <CheckCircle className="text-green-500 h-5 w-5" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {quiz._count.questions} Questions
                  </span>
                  
                  {isAttempted ? (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/classroom/quizzes/${quiz.id}/result`}>View Score</Link>
                    </Button>
                  ) : (
                    <Button size="sm" asChild>
                      <Link href={`/classroom/quizzes/${quiz.id}`}>Start Quiz</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {quizzes.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p>No quizzes have been posted yet.</p>
        </div>
      )}
    </div>
  )
}