"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Define the types for the Quiz and Questions
type Question = {
  id: string
  question: string
  options: string[]
}

type QuizProps = {
  quizId: string
  quizTitle: string
  questions: Question[]
}

export default function QuizPlay({ quizId, quizTitle, questions }: QuizProps) {
  const router = useRouter()
  
  // State to track loading and selected answers
  const [loading, setLoading] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})

  // Handle selecting an option
  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmit = async () => {
    // Basic validation: Ensure all questions are answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting.")
      return
    }

    if (loading) return

    try {
      setLoading(true)

      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quiz")
      }

      if (data.success) {
        alert(`Quiz Finished! Your score: ${data.score}/${data.totalQuestions}`)
        router.refresh()
        router.push("/classroom/quizzes")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">{quizTitle}</h1>

      {questions.map((q, index) => (
        <div key={q.id} className="space-y-4 border-b pb-6">
          <p className="font-medium">
            {index + 1}. {q.question}
          </p>
          <div className="grid gap-2">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(q.id, idx)}
                className={`p-3 text-left border rounded-lg transition ${
                  selectedAnswers[q.id] === idx
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button 
        onClick={handleSubmit} 
        disabled={loading} 
        className="w-full h-12 text-lg"
      >
        {loading ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  )
}