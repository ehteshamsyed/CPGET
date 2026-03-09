import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Video } from "lucide-react"
import LiveClassCard from "./LiveClassCard" // ✅ Local import

export default async function StudentLivePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const classes = await prisma.liveClass.findMany({
    where: { 
      scheduledAt: { 
        // Show classes from 2 hours ago (in case they're still running) onwards
        gte: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) 
      } 
    },
    orderBy: { scheduledAt: "asc" }
  })

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Lectures</h1>
        <div className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">
          Region: IST (GMT+5:30)
        </div>
      </div>
      
      <div className="grid gap-4">
        {classes.map((cls) => (
          <LiveClassCard key={cls.id} cls={cls} />
        ))}

        {classes.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <Video className="h-12 w-12 mx-auto text-slate-300 mb-2" />
            <p className="text-muted-foreground font-medium">No sessions scheduled right now.</p>
            <p className="text-xs text-slate-400 mt-1">Check back later for updates from your teacher.</p>
          </div>
        )}
      </div>
    </div>
  )
}