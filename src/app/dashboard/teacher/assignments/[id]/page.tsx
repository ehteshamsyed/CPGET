import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import GradeInput from "./GradeInput.tsx/page"; 

export default async function AssignmentReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "TEACHER") redirect("/");

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      submissions: {
        include: { student: true },
        orderBy: { submittedAt: 'desc' }
      }
    }
  });

  if (!assignment) notFound();

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{assignment.title}</CardTitle>
          <p className="text-muted-foreground">{assignment.description}</p>
        </CardHeader>
      </Card>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Submission Content</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[200px]">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignment.submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.student.name}</TableCell>
                <TableCell className="max-w-md truncate italic">
                  {sub.content}
                </TableCell>
                <TableCell>
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {/* ✅ FIXED PROP TYPE CASTING */}
                  <GradeInput 
                    submissionId={sub.id} 
                    currentGrade={sub.grade as number | null} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {assignment.submissions.length === 0 && (
          <div className="p-10 text-center text-slate-500">No submissions yet.</div>
        )}
      </div>
    </div>
  );
}