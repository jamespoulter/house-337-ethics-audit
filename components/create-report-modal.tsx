"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, FileText, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { ToastAction } from "@/components/ui/toast"

interface CreateReportModalProps {
  auditId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    title: string
    description: string
    customInstructions: string
  }) => Promise<void>
  onProgress?: (data: string) => void
  isGenerating?: boolean
  onReportGenerated?: (reportId: string) => void
}

const progressPhases = {
  INITIALIZING: {
    message: "Preparing report generation...",
    progress: 5
  },
  FETCHING_DATA: {
    message: "Gathering audit data...",
    progress: 15
  },
  ANALYZING: {
    message: "Analyzing ethical assessment results...",
    progress: 30
  },
  GENERATING: {
    message: "Creating comprehensive report...",
    progress: 60
  },
  SAVING: {
    message: "Finalizing and saving report...",
    progress: 90
  },
  COMPLETE: {
    message: "Report generated successfully!",
    progress: 100
  }
} as const

type ProgressPhase = keyof typeof progressPhases

interface ProgressDisplayProps {
  phase: string
  progress: number
  message: string
}

function ProgressDisplay({ phase, progress, message }: ProgressDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {progress < 100 ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

export function CreateReportModal({
  auditId,
  open,
  onOpenChange,
  onSubmit,
  onProgress,
  isGenerating = false,
  onReportGenerated,
}: CreateReportModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generationPhase, setGenerationPhase] = useState<string>("")
  const [reportId, setReportId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customInstructions: "",
  })

  useEffect(() => {
    if (!open) {
      setProgress(0)
      setIsLoading(false)
      setGenerationPhase("")
      setReportId(null)
      setFormData({
        title: "",
        description: "",
        customInstructions: "",
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setProgress(progressPhases.INITIALIZING.progress)
    setGenerationPhase(progressPhases.INITIALIZING.message)

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          ...formData
        }),
      })

      if (!response.ok) throw new Error('Failed to start report generation')
      if (!response.body) throw new Error('Response body is empty')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.status === 'complete') {
                setReportId(data.reportId)
                setProgress(progressPhases.COMPLETE.progress)
                setGenerationPhase(progressPhases.COMPLETE.message)
                onReportGenerated?.(data.reportId)
                toast({
                  title: "Report Generated Successfully",
                  description: "Your report is ready to view",
                  action: (
                    <ToastAction altText="View Report" onClick={() => handleViewReport(data.reportId)}>
                      View Report
                    </ToastAction>
                  ),
                })
                return
              }

              if (data.phase) {
                const phaseKey = data.phase.toUpperCase() as ProgressPhase
                const phase = progressPhases[phaseKey]
                if (phase) {
                  setProgress(data.progress || phase.progress)
                  setGenerationPhase(data.message || phase.message)
                }
              }
            } catch (error) {
              console.error('Error parsing progress data:', error)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleViewReport = (id: string) => {
    if (id) {
      onReportGenerated?.(id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Generate a comprehensive report based on your AI ethics audit data.
              Customize the report generation with specific instructions.
            </DialogDescription>
          </DialogHeader>

          {!isLoading ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for your report"
                  required
                  disabled={isLoading || isGenerating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Report Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the purpose of this report"
                  className="min-h-[80px]"
                  required
                  disabled={isLoading || isGenerating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customInstructions">Custom Instructions (Optional)</Label>
                <Textarea
                  id="customInstructions"
                  name="customInstructions"
                  value={formData.customInstructions}
                  onChange={handleInputChange}
                  placeholder="Add any specific instructions for the AI to follow when generating the report"
                  className="min-h-[100px]"
                  disabled={isLoading || isGenerating}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-8">
              <ProgressDisplay
                phase={generationPhase}
                progress={progress}
                message={generationPhase}
              />
              {reportId && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <FileText className="h-4 w-4" />
                    <span>Report "{formData.title}" has been generated</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {!isLoading && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading || isGenerating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading || isGenerating || !formData.title || !formData.description}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </Button>
              </>
            )}
            {reportId && (
              <Button
                type="button"
                onClick={() => handleViewReport(reportId)}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Generated Report
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 