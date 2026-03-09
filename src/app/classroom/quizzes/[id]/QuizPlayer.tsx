"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react"

interface Question {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
}

interface Quiz {
  id: string
  questions: Question[]
}

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const router = useRouter()
  
  // State for Navigation and Answers
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const currentQuestion = quiz.questions[currentIdx]
  const totalQuestions = quiz.questions.length
  const progress = ((currentIdx + 1) / totalQuestions) * 100
  const isLastQuestion = currentIdx === totalQuestions - 1
  const hasAnsweredCurrent = !!answers[currentQuestion.id]

  // Handlers
  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) setCurrentIdx(currentIdx + 1)
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const finishQuiz = async () => {
    // 1. Basic Validation
    const answeredCount = Object.keys(answers).length
    if (answeredCount < totalQuestions) {
      if (!confirm(`You have only answered ${answeredCount}/${totalQuestions} questions. Submit anyway?`)) {
        return
      }
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })

      if (res.ok) {
        // Redirect to the specific result page we just created
        router.push(`/classroom/quizzes/${quiz.id}/result`)
        router.refresh()
      } else {
        alert("Failed to save quiz results. Please check your connection.")
      }
    } catch (e) {
      alert("An error occurred during submission.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Progress Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-end text-sm font-semibold">
          <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Question {currentIdx + 1} of {totalQuestions}
          </span>
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">
            {progress.toFixed(0)}% Completed
          </span>
        </div>
        <Progress value={progress} className="h-3 bg-slate-100 shadow-inner" />
      </div>

      {/* Question Card */}
      <Card className="shadow-xl border-t-4 border-t-blue-600">
        <CardHeader className="pt-8 px-8">
          <CardTitle className="text-xl md:text-2xl font-bold leading-snug text-slate-800">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 pt-4 space-y-6">
          <RadioGroup 
            value={answers[currentQuestion.id] || ""} 
            onValueChange={(val) => setAnswers({...answers, [currentQuestion.id]: val})}
            className="grid gap-4"
          >
            {(['A', 'B', 'C', 'D'] as const).map((letter) => {
              const optionKey = `option${letter}` as keyof Question
              const isSelected = answers[currentQuestion.id] === letter

              return (
                <div key={letter}>
                  <RadioGroupItem value={letter} id={letter} className="sr-only" />
                  <Label 
                    htmlFor={letter} 
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" 
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-colors ${
                      isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-500"
                    }`}>
                      {letter}
                    </div>
                    <span className={`text-base font-medium ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                      {currentQuestion[optionKey]}
                    </span>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentIdx === 0 || submitting}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            
            {isLastQuestion ? (
              <Button 
                onClick={finishQuiz} 
                disabled={submitting} 
                className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8 shadow-md transition-all active:scale-95"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="h-4 w-4" /> Finish Quiz</>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                disabled={!hasAnsweredCurrent}
                className="gap-2 px-8"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Footer Info */}
      <p className="text-center text-xs text-slate-400">
        Your progress is saved locally. Do not refresh the page until you submit.
      </p>
    </div>
  )
}