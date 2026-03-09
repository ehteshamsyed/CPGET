"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Check, Loader2 } from "lucide-react"

export default function GradeInput({ 
  submissionId, 
  currentGrade 
}: { 
  submissionId: string, 
  currentGrade: number | null // Adjusted to match your schema's Int?
}) {
  const [grade, setGrade] = useState(currentGrade?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateGrade = async (val: string) => {
    // If empty, don't send or send null
    if (val === currentGrade?.toString()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/submissions/${submissionId}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: val }), // Sending as string, API will parse it
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error("Error saving grade:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input 
          type="number" // Forces numeric keyboard/input
          defaultValue={grade} 
          placeholder="Score"
          onBlur={(e) => updateGrade(e.target.value)}
          className={`h-8 w-24 transition-all ${saved ? "border-green-500 bg-green-50" : ""}`}
        />
      </div>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
      {saved && <Check className="h-4 w-4 text-green-500" />}
    </div>
  )
}