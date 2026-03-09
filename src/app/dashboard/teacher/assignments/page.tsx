import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CreateAssignmentDialog from "./CreateAssignmentDialog"
import DeleteAssignmentButton from "./DeleteAssignmentButton"

export default async function TeacherAssignmentsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "TEACHER") redirect("/")

  const items = await prisma.assignment.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments.</p>
        </div>
        <CreateAssignmentDialog />
      </div>

      <div className="grid gap-4">
        {items.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{a.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Due: {a.dueDate.toISOString().slice(0, 10)}
                </p>
              </div>
              <DeleteAssignmentButton id={a.id} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {a.description}
              </p>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <p className="text-muted-foreground">No assignments yet.</p>
        )}
      </div>
    </div>
  )
}