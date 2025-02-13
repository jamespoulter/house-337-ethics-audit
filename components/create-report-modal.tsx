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

interface CreateReportModalProps {
  auditId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    title: string
    description: string
    customInstructions: string
  }) => Promise<void>
  isGenerating?: boolean
  generatedContent?: string
}

interface ProgressPhase {
  phase: string
  message: string
  progress: number
}

export function CreateReportModal({
  auditId,
  open,
  onOpenChange,
  onSubmit,
  isGenerating = false,
  generatedContent = "",
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

  useEffect(() => {
    if (!generatedContent) return

    try {
      if (generatedContent.startsWith('data: ')) {
        const data = generatedContent.slice(6).trim()
        
        if (data === "[DONE]") {
          return
        }

        try {
          const parsedData = JSON.parse(data)
          
          if (parsedData.status === "complete") {
            setProgress(100)
            setGenerationPhase("Report generation complete!")
            setReportId(parsedData.reportId)
            setIsLoading(false)
            
            toast({
              title: "Success!",
              description: "Your report has been generated successfully.",
              variant: "success",
            })
            return
          }

          if (parsedData.error) {
            toast({
              title: "Error",
              description: parsedData.error,
              variant: "destructive",
            })
            setIsLoading(false)
            return
          }

          if (parsedData.phase) {
            setGenerationPhase(parsedData.message || "Processing...")
            setProgress(parsedData.progress || 0)
          }

          if (parsedData.text) {
            return
          }
        } catch (e) {
          console.error('Failed to parse SSE data:', data, e)
        }
      }
    } catch (error) {
      console.error('Error processing generated content:', error)
      toast({
        title: "Error",
        description: "Failed to process report content. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [generatedContent, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setProgress(0)
    setGenerationPhase("Initializing report generation...")

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting report:', error)
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleViewReport = () => {
    if (reportId) {
      onOpenChange(false)
      router.push(`/audits/${auditId}?tab=reports&highlight=${reportId}`)
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {progress < 100 ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <p className="text-sm font-medium">{generationPhase}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
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
                onClick={handleViewReport}
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