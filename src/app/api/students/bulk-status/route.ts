import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/requireRole"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req: Request) {
  const { error } = await requireRole("TEACHER")
  if (error) return error

  const { ids, isApproved } = await req.json()

  // Update records
  await prisma.user.updateMany({
    where: { id: { in: ids }, role: "STUDENT" },
    data: { isApproved },
  })

  // Fetch updated users to send emails
  if (isApproved) {
    const users = await prisma.user.findMany({ where: { id: { in: ids } } })
    
    // Send emails in parallel
    await Promise.all(users.map(user => 
      resend.emails.send({
        from: 'CPGET Nutrition <onboarding@resend.dev>',
        to: [user.email],
        subject: 'CPGET Account Activated',
        html: `<p>Hi ${user.name}, your batch approval is complete. You can now access the portal.</p>`
      })
    ))
  }

  return NextResponse.json({ success: true, updatedCount: ids.length })
}