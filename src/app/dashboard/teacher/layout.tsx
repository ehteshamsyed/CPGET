import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-bold text-blue-600">DASHBOARD</h2>

        <Separator />

        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard/teacher">Overview</Link>
          <Link href="/dashboard/teacher/assignments">Assignments</Link>
          <Link href="/dashboard/teacher/quizzes">Mock Test</Link>
          <Link href="/dashboard/teacher/live">Live Classes</Link>
          <Link href="/dashboard/teacher/doubts">Doubts</Link>
          <Link href="/dashboard/teacher/students">Students</Link>
        </nav>

        <Separator />

        <Button variant="outline" asChild>
          <Link href="/">Back to Website</Link>
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  )
}