"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

export default function AssignmentSubmissionPage() {
  const { id } = useParams()
  const router = useRouter()
  const [content, setContent] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)

  // Fetch current submission if it exists
  React.useEffect(() => {
    async function getSubmission() {
      try {
        const res = await fetch(`/api/assignments/${id}/submission`)
        if (res.ok) {
          const data = await res.json()
          if (data?.content) setContent(data.content)
        }
      } finally {
        setFetching(false)
      }
    }
    getSubmission()
  }, [id])

  async function handleSubmit() {
    if (content.length < 10) {
      alert("Please provide a more detailed submission.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/assignments/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        router.push("/classroom/assignments")
        router.refresh()
      } else {
        alert("Failed to submit")
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-10 text-center">Loading assignment details...</div>

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Link href="/classroom/assignments">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Submit Assignment</CardTitle>
          <CardDescription>
            Paste your Google Drive link or type your response below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your submission or paste a link here..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full gap-2"
          >
            <Send className="h-4 w-4" />
            {loading ? "Submitting..." : "Confirm Submission"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}