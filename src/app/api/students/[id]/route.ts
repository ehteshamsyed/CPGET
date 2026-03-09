import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/requireRole"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("TEACHER")
  if (error) return error

  const { id } = await context.params
  const { isApproved } = await req.json()

  const user = await prisma.user.update({
    where: { id, role: "STUDENT" },
    data: { isApproved },
  })

  // 📧 If approved, notify the student
  if (isApproved) {
    await resend.emails.send({
      from: 'CPGET Nutrition <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Account Activated! | CPGET Portal',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #16a34a;">Access Granted</h2>
          <p>Hello ${user.name}, your account has been approved. You can now log in to the classroom.</p>
          <a href="${process.env.NEXTAUTH_URL}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
        </div>
      `,
    });
  }

  return NextResponse.json({ success: true })
}