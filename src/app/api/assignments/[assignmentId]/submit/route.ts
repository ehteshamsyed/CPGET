import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> } // Type as Promise
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Await the params to unwrap the ID ✅
    const { assignmentId } = await params;

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // 2. Perform the Upsert using the unwrapped assignmentId
    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: assignmentId,
          studentId: session.user.id,
        },
      },
      update: {
        content: content,
        submittedAt: new Date(), // Update the timestamp on resubmission
      },
      create: {
        assignmentId: assignmentId,
        studentId: session.user.id,
        content: content,
      },
    });

    return NextResponse.json(submission);
  } catch (error: any) {
    console.error("ASSIGNMENT_SUBMIT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" }, 
      { status: 500 }
    );
  }
}