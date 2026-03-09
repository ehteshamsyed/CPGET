import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ClassroomAssignmentsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "STUDENT") redirect("/")

  // Fetch assignments and the student's submission for each in one go
  const assignments = await prisma.assignment.findMany({
    include: {
      submissions: {
        where: { studentId: session.user.id }
      }
    },
    orderBy: { dueDate: "asc" },
  })

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">Submit your work and check your grades.</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((a) => {
          const submission = a.submissions[0]
          const isOverdue = new Date() > new Date(a.dueDate) && !submission

          return (
            <Card key={a.id} className={submission ? "bg-slate-50/50" : ""}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{a.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Due: {new Date(a.dueDate).toLocaleDateString()}
                  </div>
                </div>
                {submission ? (
                  <Badge className="bg-green-100 text-green-700">Submitted</Badge>
                ) : isOverdue ? (
                  <Badge variant="destructive">Overdue</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 line-clamp-3">{a.description}</p>
                {submission?.grade !== null && submission?.grade !== undefined && (
                  <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Grade: {submission.grade} / 100
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/classroom/assignments/${a.id}`} className="w-full">
                  <Button variant={submission ? "outline" : "default"} className="w-full">
                    {submission ? "Edit Submission" : "Submit Work"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}

        {assignments.length === 0 && (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No assignments assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}