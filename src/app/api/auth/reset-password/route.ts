import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // 1. Find valid user with non-expired token
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Must be greater than "now"
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Update User and clear reset fields
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error: unknown) {
    console.error("Reset Password API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}