"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { ArrowLeft, Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthMode = "login" | "signup" | "forgot"

export default function AuthDialog() {
  const router = useRouter()

  const [mode, setMode] = useState<AuthMode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // 1. FORGOT PASSWORD Logic
      if (mode === "forgot") {
        if (!email) throw new Error("Email is required.")
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Request failed")
        setMessage("Check your email for a reset link.")
        return
      }

      // 2. SIGNUP Logic
      if (mode === "signup") {
        if (!name.trim() || !email || !password) throw new Error("All fields are required.")
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Signup failed")
        setMessage("Account created. Awaiting teacher approval.")
        setMode("login")
        return
      }

      // 3. LOGIN Logic
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) throw new Error(result.error)

      const session = await getSession()
      if (session?.user.role === "TEACHER") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/classroom")
      }

      router.refresh()
    } catch (err: unknown) {
      // FIX for ESLint @typescript-eslint/no-explicit-any
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog onOpenChange={(open) => { if(!open) { setMode("login"); setError(""); setMessage(""); }}}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
          Login / Signup
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {mode === "forgot" && (
            <button 
              onClick={() => setMode("login")}
              className="flex items-center text-xs text-slate-500 hover:text-blue-600 mb-2 transition-colors w-fit"
            >
              <ArrowLeft className="h-3 w-3 mr-1" /> Back to login
            </button>
          )}
          <DialogTitle className="text-xl font-bold">
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset Password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login" && "Enter your credentials to access your classroom."}
            {mode === "signup" && "Fill in your details. Teacher approval is required."}
            {mode === "forgot" && "Enter your email to receive a recovery link."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "login" && (
                  <button 
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </Button>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-100">
              {message}
            </p>
          )}

          <div className="text-sm text-center text-slate-600 pt-2 border-t mt-4">
            {mode === "forgot" ? (
               "Suddenly remembered?" 
            ) : (
               mode === "login" ? "New to CPGET?" : "Already have an account?"
            )}{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}