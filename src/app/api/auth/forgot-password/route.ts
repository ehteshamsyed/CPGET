import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"
import { db } from "@/lib/db"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // 1. Check if user exists
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      // Security tip: Don't reveal if user doesn't exist. Just say "Email sent"
      return NextResponse.json({ message: "Email sent" })
    }

    // 2. Generate token and 1-hour expiry
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 3600000) 

    // 3. Save to Database
    await db.user.update({
      where: { email },
      data: { 
        resetToken, 
        resetTokenExpiry: expiry 
      }
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    // 4. Send Email
    await resend.emails.send({
      from: 'CPGET Nutrition <auth@resend.dev>',
      to: [email],
      subject: 'Reset your CPGET Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p style="font-size: 12px; color: #64748b;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ message: "Email sent" })
  } catch (error: unknown) {
    console.error("Forgot Password Error:", error) 
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}