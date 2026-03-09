"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Calendar as CalendarIcon } from "lucide-react"

export default function teacherLivePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    topic: "",
    meetingLink: "",
    scheduledAt: ""
  })

  async function handleSchedule() {
    if (!form.topic || !form.meetingLink || !form.scheduledAt) return
    
    setLoading(true)
    try {
      const res = await fetch("/api/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({ topic: "", meetingLink: "", scheduledAt: "" })
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="text-red-500" /> Schedule Live Class
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Topic (e.g. Macronutrients Deep Dive)" 
            value={form.topic}
            onChange={(e) => setForm({...form, topic: e.target.value})}
          />
          <Input 
            placeholder="Meeting Link (Google Meet/Zoom)" 
            value={form.meetingLink}
            onChange={(e) => setForm({...form, meetingLink: e.target.value})}
          />
          <Input 
            type="datetime-local" 
            value={form.scheduledAt}
            onChange={(e) => setForm({...form, scheduledAt: e.target.value})}
          />
          <Button onClick={handleSchedule} className="w-full" disabled={loading}>
            {loading ? "Scheduling..." : "Go Live"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}