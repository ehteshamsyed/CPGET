import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Video, 
  HelpCircle, 
  PenTool, 
  BookOpen, 
  Bell, 
  ArrowRight,
  Calendar,
  Clock
} from "lucide-react"

export default async function ClassroomHome() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "STUDENT") {
    redirect("/")
  }

  const [announcement, nextClass] = await Promise.all([
    prisma.announcement.findUnique({ where: { id: "GLOBAL" } }),
    prisma.liveClass.findFirst({
      where: { scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
    })
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      
      {/* 1. Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, {session.user.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-100 text-lg max-w-md">
              Ready to continue your CPGET Nutrition preparation? Here is what's happening today.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-xl" asChild>
             <Link href="/classroom/live">View All Classes</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 2. Primary Focus: Next Live Class & Announcement */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Announcement: Floating Style */}
          {announcement && (
            <div className="group relative rounded-2xl border border-amber-200 bg-amber-50/50 p-6 transition-all hover:bg-amber-50">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                  <Bell className="h-6 w-6 animate-ring" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-amber-900 text-lg">{announcement.title}</h3>
                  <p className="text-amber-800 leading-relaxed">{announcement.content}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Class Card */}
          <Card className="overflow-hidden border-none shadow-lg ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Video className="h-5 w-5 text-indigo-600" />
                  Next Live Lecture
                </CardTitle>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200/50 px-2 py-1 rounded">
                  Upcoming
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {nextClass ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">{nextClass.topic}</h2>
                    <div className="flex flex-wrap gap-4 text-slate-600">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(nextClass.scheduledAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {new Date(nextClass.scheduledAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg px-8" asChild>
                    <a href={nextClass.meetingLink} target="_blank" rel="noreferrer">
                      Join via Google Meet
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500">No classes scheduled for today.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. Right Column: Quick Navigation Links */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg px-1">Learning Tools</h3>
          
          <QuickLink 
            href="/classroom/doubts" 
            title="Ask Doubts" 
            desc="Get answers from teachers" 
            icon={<HelpCircle className="h-6 w-6" />}
            color="text-blue-600"
            bg="bg-blue-50"
          />

          <QuickLink 
            href="/classroom/quizzes" 
            title="Quizzes" 
            desc="Test your knowledge" 
            icon={<PenTool className="h-6 w-6" />}
            color="text-purple-600"
            bg="bg-purple-50"
          />

          <QuickLink 
            href="/classroom/assignments" 
            title="Assignments" 
            desc="Track your submissions" 
            icon={<BookOpen className="h-6 w-6" />}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
        </div>

      </div>
    </div>
  )
}

// Helper Component for consistent Quick Links
function QuickLink({ href, title, desc, icon, color, bg }: any) {
  return (
    <Link href={href} className="group block">
      <Card className="transition-all duration-300 hover:shadow-md hover:border-slate-300 group-hover:-translate-x-1">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`rounded-xl ${bg} ${color} p-3 transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 flex items-center justify-between">
              {title}
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h4>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}