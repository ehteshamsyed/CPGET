import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);
const TEACHER_EMAIL = "your-teacher-email@gmail.com"; 

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user record
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.STUDENT,
        isApproved: false, 
      },
    })

    // 1. Send Welcome Email to Student
    await resend.emails.send({
      from: 'CPGET Nutrition <onboarding@resend.dev>',
      to: [email],
      subject: 'Registration Received | CPGET Portal',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb;">Welcome, ${name}!</h2>
          <p>Your registration is successful. Your account is currently <b>Pending Approval</b>.</p>
          <p>You will receive another email once the instructor activates your account.</p>
        </div>
      `,
    });

    // 2. Send Alert Email to Teacher
    await resend.emails.send({
      from: 'CPGET System <onboarding@resend.dev>',
      to: [TEACHER_EMAIL],
      subject: 'New Student Registration Alert',
      html: `<p>New student <b>${name}</b> (${email}) is waiting for approval in the dashboard.</p>`,
    });

    return NextResponse.json({ message: "Account created. Awaiting teacher approval." })
    
  } catch { 
    // ✅ Catch without variables removes the ESLint unused-vars error entirely.
    console.error("Registration Error occurred");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}