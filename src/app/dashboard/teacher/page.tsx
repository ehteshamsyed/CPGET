import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, HelpCircle, UserCheck, PlusCircle, BookOpen, Video } from "lucide-react"
import AnnouncementDialog from "./AnnouncementDialog"

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions)

  // 🛡️ Security Guard
  if (!session || session.user.role !== "TEACHER") {
    redirect("/")
  }

  // 🚀 Parallel Data Fetching
  const [announcement, totalStudents, pendingCount, pendingDoubts] = await Promise.all([
    prisma.announcement.findUnique({ where: { id: "GLOBAL" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "STUDENT", isApproved: false } }),
    prisma.doubt.count({ where: { answer: null } }),
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back,</h1>
          <p className="text-muted-foreground text-lg">Here is what is happening with your course today.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{pendingCount}</p>
              {pendingCount > 0 && <Badge variant="destructive">Action Required</Badge>}
            </div>
            <Button variant="link" className="px-0 h-auto mt-2 text-blue-600" asChild>
              <Link href="/dashboard/teacher/students">Review applications →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unanswered Doubts</CardTitle>
            <HelpCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingDoubts}</p>
            <Button variant="link" className="px-0 h-auto mt-2 text-blue-600" asChild>
              <Link href="/dashboard/teacher/doubts">View all doubts →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Management Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col gap-2 shadow-sm border-dashed" asChild>
            <Link href="/dashboard/teacher/assignments">
              <PlusCircle className="h-5 w-5" />
              New Assignment
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 shadow-sm border-dashed" asChild>
            <Link href="/dashboard/teacher/quizzes">
              <BookOpen className="h-5 w-5" />
              Manage Quizzes
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 shadow-sm border-dashed" asChild>
            <Link href="/dashboard/teacher/live">
              <Video className="h-5 w-5" />
              Live Class
            </Link>
          </Button>
          <AnnouncementDialog />
        </div>
      </div>

      {/* Global Announcement Section */}
      {announcement && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-900 text-lg flex items-center gap-2">
              📢 Active Global Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h3 className="font-bold text-xl text-slate-900">{announcement.title}</h3>
            <p className="text-slate-700 leading-relaxed">{announcement.content}</p>
            <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Last updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
              <span className="italic">Visible to all students</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}