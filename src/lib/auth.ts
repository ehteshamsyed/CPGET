import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import { Role } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error("Incorrect password")
        }

        if (!user.isApproved) {
          throw new Error("Your account is pending teacher approval.")
        }

        // ✅ Return only what we need to store in the token
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 🚀 INITIAL LOGIN: Attach role to the token
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // 💡 OPTIONAL: Handle manual session updates
      if (trigger === "update" && session?.role) {
        token.role = session.role
      }

      // ❌ REMOVED: prisma.user.findUnique here. 
      // We trust the JWT. If the user is unapproved later, 
      // they will be logged out when the token expires 
      // or you can add a small check only on critical actions.

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },

  pages: {
    signIn: "/", // Redirects to your landing page with the AuthDialog
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}