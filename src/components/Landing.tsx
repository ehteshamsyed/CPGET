"use client"

import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Sparkles, graduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"

interface LandingProps {
  session: Session | null
}

export default function Landing({ session }: LandingProps) {
  const userRole = session?.user?.role;
  const dashboardHref = userRole === "TEACHER" ? "/dashboard/teacher" : "/classroom";

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100 relative overflow-hidden">
      {/* Background Decor - Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 48L54 60L6 60L6 48L54 48Z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
      />
      
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          
          {/* Left: Hero Section */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              <span>Nutrition & Dietetics Portal</span>
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl lg:leading-[1.1]">
              Master your <span className="text-blue-600">CPGET,NCET</span> Preparation
            </h1>

            <p className="max-w-md text-lg text-slate-600 leading-relaxed">
              The all-in-one digital classroom designed specifically for 
              <span className="font-semibold text-slate-900"> Nutrition students</span>. 
              Join live lectures and track your academic progress with ease.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {session ? (
                <div className="space-y-4 w-full">
                  <div className="p-4 rounded-2xl bg-white border shadow-sm inline-block">
                     <p className="text-sm text-slate-500">
                       Welcome back,
                     </p>
                  </div>
                  <br/>
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-xl text-lg shadow-xl shadow-blue-200 transition-all hover:scale-[1.02]">
                    <Link href={dashboardHref} className="gap-2">
                      Enter {userRole === "TEACHER" ? "Admin Panel" : "Classroom"}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                   <p className="text-slate-500 font-medium italic">Ready to start your journey?</p>
                   <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">Login via the menu to continue</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Feature Card (Enhanced) */}
          <div className="relative">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-blue-400/10 rounded-[2.5rem] blur-3xl" />
            
            <Card className="relative border-slate-200/60 shadow-2xl rounded-[2rem] overflow-hidden">
              <div className="h-2 w-full bg-blue-600" />
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-slate-800">Platform Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                {[
                  { title: "Live Classes", desc: "Instant access to Google Meet links" },
                  { title: "Smart Assignments", desc: "Upload and track your submissions" },
                  { title: "Interactive Quizzes", desc: "Real-time CPGET mock testing" },
                  { title: "Doubt Clearing", desc: "Direct communication with teachers" },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="mt-1 rounded-full bg-blue-50 p-1 group-hover:bg-blue-100 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none">{f.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 rounded-xl bg-amber-50 p-4 border border-amber-100">
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    🔒 <span className="font-bold uppercase ml-1">Secure Portal:</span> Student accounts are only activated after teacher verification.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-slate-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-900">
             <div className="h-2 w-2 rounded-full bg-blue-600" />
             CPGET NUTRITION
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} Education Portal • Developed for Academic Excellence
          </p>
        </footer>
      </main>
    </div>
  )
}