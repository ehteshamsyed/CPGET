import { prisma } from "@/lib/prisma" // Standardized named import
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  // 💡 Senior Tip: When using "credentials", NextAuth automatically uses JWT. 
  // We keep the adapter for future OAuth (Google/GitHub) support, 
  // but explicitly set strategy to "jwt" for speed.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 1. Validate input exists
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // 2. Fetch user from DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }, // Case-insensitive safety
        });

        // 3. User existence & Password check
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // 4. Permission Check
        // Allow Teachers through regardless, check approval for Students
        if (user.role === "STUDENT" && !user.isApproved) {
          throw new Error("PENDING_APPROVAL");
        }

        // 5. Return object for JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Runs on login - transfer data from User object to Token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Handle session updates (e.g., if role changes without logging out)
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      // Transfer data from Token to Session object for use in components
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any; // Cast to your Prisma Role
      }
      return session;
    },
  },

  pages: {
    signIn: "/", // UI: Where your login dialog is
    error: "/",  // UI: Redirect home if login fails
  },

  secret: process.env.NEXTAUTH_SECRET,
};