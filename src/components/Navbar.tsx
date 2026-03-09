"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

import AuthDialog from "@/components/AuthDialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/classroom", label: "Classroom" },
  { href: "/classroom/live", label: "Live Classes" },
  { href: "/classroom/quizzes", label: "Quizzes" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isAuthed = !!session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4">
        
        {/* --- LOGO SECTION START --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-3">
            {/* LARGE IMAGE: Increased to h-16 w-16 (64px) */}
            <div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-sm">
              <Image 
                src="/logo.jpg" 
                alt="Logo" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            {/* SMALLER TEXT: Reduced to text-xl for a modern look */}
            <span className="text-xl font-black tracking-tighter text-blue-400">
              CPGET
            </span>
          </div>
        </Link>
        {/* --- LOGO SECTION END --- */}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-slate-100" />
          ) : isAuthed ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end leading-none">
                <span className="text-xs font-bold text-slate-900">
                  {session?.user?.name?.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 uppercase">{session?.user?.role}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </div>
          ) : (
            <AuthDialog />
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-7 w-7 text-slate-600" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <SheetHeader className="text-left border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                     <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                  </div>
                  <SheetTitle className="text-xl font-black">CPGET Portal</SheetTitle>
                </div>
              </SheetHeader>
              
              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((l) => {
                  const active = pathname === l.href
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={cn(
                        "rounded-md px-3 py-3 text-sm font-medium transition",
                        active ? "bg-blue-600 text-white" : "hover:bg-slate-100"
                      )}
                    >
                      {l.label}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}