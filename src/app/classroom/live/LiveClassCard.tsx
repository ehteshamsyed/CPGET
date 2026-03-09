"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, ExternalLink, Clock } from "lucide-react"

interface LiveClassProps {
  cls: {
    id: string
    topic: string
    scheduledAt: Date
    meetingLink: string
  }
}

export default function LiveClassCard({ cls }: LiveClassProps) {
  const now = new Date();
  const scheduledTime = new Date(cls.scheduledAt);
  
  // Logic: Active 15 mins before start until 2 hours after start
  const isLive = now.getTime() >= (scheduledTime.getTime() - 15 * 60000) && 
                 now.getTime() <= (scheduledTime.getTime() + 120 * 60000);

  return (
    <Card className={`border-l-4 transition-all ${isLive ? "border-l-green-600 shadow-md ring-1 ring-green-100" : "border-l-red-500 opacity-80"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{cls.topic}</CardTitle>
          {isLive && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Live Now
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className={`h-4 w-4 ${isLive ? "text-green-600" : ""}`} />
              <span className={isLive ? "font-medium text-green-700" : ""}>
                {scheduledTime.toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>
          <a 
            href={isLive ? cls.meetingLink : "#"} 
            target={isLive ? "_blank" : "_self"} 
            rel="noopener noreferrer"
            onClick={(e) => !isLive && e.preventDefault()}
          >
            <Button 
              className={isLive ? "bg-green-600 hover:bg-green-700" : "bg-slate-200 text-slate-500 cursor-not-allowed"}
              disabled={!isLive}
            >
              {isLive ? "Join Google Meet" : "Starts Soon"}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}