"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { SliderWithRules } from "@/components/ui/slider-with-rules"
import { Dial } from "@/components/ui/dial"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffInterviewLog } from "@/components/staff-interview-log"
import { RACIMatrix } from "@/components/raci-matrix"
import { Questionnaire } from "@/components/questionnaire"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ClipboardList, Users, Network, FileText, Settings, BarChart, Loader2, Save, FileSpreadsheet } from "lucide-react"
import { getAuditById, updateAudit } from "@/lib/supabase"
import { AuditWithDetails, EthicalAssessmentCategory, EthicalAssessmentResponse } from "@/lib/types"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import debounce from "lodash/debounce"
import { Badge } from "@/components/ui/badge"
import { CreateReportModal } from "@/components/create-report-modal"
import { useCompletion } from 'ai/react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/database.types"

interface Question {
  id: string
  question: string
}

interface AuditCategory {
  questions: Record<string, number>
  score: number
}

interface AuditData {
  id: string
  name: string
  organization: string
  description: string
  transparency: AuditCategory
  privacy: AuditCategory
  inclusivity: AuditCategory
  accountability: AuditCategory
  sustainability: AuditCategory
  complianceAndGovernance: AuditCategory
  biasAssessment: number
  dataGovernance: number
  ethicalFramework: string
  risksAndChallenges: string
  mitigationStrategies: string
  continuousMonitoring: string
  status: string
  overall_score: number
}

type EthicalQuestions = {
  [K in keyof Omit<AuditData, "id" | "name" | "organization" | "description" | "biasAssessment" | "dataGovernance" | "ethicalFramework" | "risksAndChallenges" | "mitigationStrategies" | "continuousMonitoring" | "status" | "overall_score">]: Question[]
}

// Define the ethical assessment questions structure
const ethicalQuestions = {
  transparency: [
    { id: "transparency-1", question: "Does the company have a clear policy for disclosing AI use across all its operations and products?" },
    { id: "transparency-2", question: "Is there a comprehensive data governance framework that covers all AI-related data collection and usage?" },
    { id: "transparency-3", question: "Does the company maintain clear documentation about the capabilities and limitations of all its AI systems?" },
    { id: "transparency-4", question: "Are there established processes for explaining AI decisions to stakeholders and affected parties?" },
  ],
  privacy: [
    { id: "privacy-1", question: "Does the company have a unified data minimization strategy across all AI implementations?" },
    { id: "privacy-2", question: "Are there company-wide standards for AI data security and protection?" },
    { id: "privacy-3", question: "Is there a standardized process for handling data subject rights across all AI systems?" },
    { id: "privacy-4", question: "Does the company maintain consistent privacy compliance across all AI initiatives?" },
  ],
  inclusivity: [
    { id: "inclusivity-1", question: "Does the company have a comprehensive strategy for testing AI systems across diverse demographics?" },
    { id: "inclusivity-2", question: "Is accessibility a mandatory requirement in the company's AI development process?" },
    { id: "inclusivity-3", question: "Are there company-wide protocols for identifying and mitigating algorithmic bias?" },
    { id: "inclusivity-4", question: "Does the company ensure its AI systems are culturally adaptable across different markets?" },
  ],
  accountability: [
    { id: "accountability-1", question: "Is there a clear organizational structure for AI governance and responsibility?" },
    { id: "accountability-2", question: "Does the company maintain centralized monitoring and logging for all AI operations?" },
    { id: "accountability-3", question: "Is there a company-wide framework for addressing AI-related grievances?" },
    { id: "accountability-4", question: "Are there established protocols for managing AI incidents across the organization?" },
  ],
  sustainability: [
    { id: "sustainability-1", question: "Does the company assess the long-term economic impact of its AI strategy?" },
    { id: "sustainability-2", question: "Is there ongoing monitoring of AI's social impact across all deployments?" },
    { id: "sustainability-3", question: "Does the company have standards for AI system efficiency and resource usage?" },
    { id: "sustainability-4", question: "Is there a company-wide strategy for reducing AI's environmental footprint?" },
  ],
  complianceAndGovernance: [
    { id: "compliance-1", question: "Does the company maintain a unified approach to AI regulatory compliance?" },
    { id: "compliance-2", question: "Is there a comprehensive ethical AI governance framework implemented across the organization?" },
    { id: "compliance-3", question: "Are compliance records systematically maintained for all AI systems?" },
    { id: "compliance-4", question: "Does the company conduct regular organization-wide AI compliance reviews?" },
  ],
}

// Define rules for each category
const ethicalRules = {
  transparency: [
    "Provide clear insight into AI decisions",
    "Communicate data usage openly",
    "Document system limitations",
  ],
  privacy: [
    "Protect user data",
    "Ensure data minimization",
    "Enable user control",
  ],
  inclusivity: [
    "Ensure equitable access",
    "Prevent discrimination",
    "Support diversity",
  ],
  accountability: [
    "Maintain clear responsibility",
    "Track system actions",
    "Enable user redress",
  ],
  sustainability: [
    "Consider long-term impacts",
    "Monitor resource usage",
    "Reduce environmental impact",
  ],
  complianceAndGovernance: [
    "Follow regulations",
    "Maintain documentation",
    "Review regularly",
  ],
}

interface AuditState extends AuditWithDetails {
  ethical_assessment: {
    [key: string]: {
      questions: { [key: string]: number }
      score: number
    }
  }
}

export default function AuditDetail() {
  const { id } = useParams()
  const { toast } = useToast()
  const [audit, setAudit] = useState<AuditState | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const router = useRouter()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportData, setReportData] = useState<{
    title: string;
    description: string;
    customInstructions: string;
  } | null>(null)
  const [reports, setReports] = useState<any[]>([])
  const supabase = createClientComponentClient<Database>()
  const searchParams = useSearchParams()
  const highlightedReportId = searchParams.get('highlight')

  // Add the useUnsavedChanges hook
  const { hasUnsavedChanges, setCurrentData } = useUnsavedChanges(audit)

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (auditData: AuditState) => {
      try {
        setIsSaving(true)
        await updateAudit(auditData.id, auditData)
        setLastSaved(new Date())
        toast({
          title: "Changes saved",
          description: "Your changes have been saved successfully.",
        })
      } catch (error) {
        toast({
          title: "Error saving changes",
          description: "Failed to save your changes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }, 1000),
    []
  )

  const {
    complete: generateReport,
    completion: reportContent,
    isLoading: isGenerating,
    error: generationError,
  } = useCompletion({
    api: '/api/reports',
    onResponse: (response) => {
      // If the response is successful, we'll get a streaming response
      if (response.ok) {
        toast({
          title: "Report Generation Started",
          description: "Your report is being generated. You can preview it in real-time.",
        })
      }
    },
    onFinish: async () => {
      // Fetch the updated reports list
      const { data: reportData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('audit_id', id)
        .order('created_at', { ascending: false })

      if (!error && reportData) {
        setReports(reportData)
      }

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      })
      
      // Don't close the modal automatically
      // setIsReportModalOpen(false)
    },
    onError: (error) => {
      console.error('Error generating report:', error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
      // Don't close the modal on error
      // setIsReportModalOpen(false)
    }
  })

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        if (!id) return
        const data = await getAuditById(id as string)
        if (data) {
          // Transform the data into the format expected by the UI
          const ethicalAssessment: AuditState['ethical_assessment'] = {}
          
          // Group responses by category
          const responsesByCategory = data.ethical_assessment_categories?.reduce((acc, category) => {
            const responses = data.ethical_assessment_responses?.filter(
              response => response.category_name === category.category_name
            ) || []
            
            acc[category.category_name] = {
              questions: responses.reduce((questions, response) => ({
                ...questions,
                [response.question_id]: response.response || 0
              }), {}),
              score: category.score || 0
            }
            return acc
          }, {} as AuditState['ethical_assessment']) || {}

          // Initialize empty categories if they don't exist
          Object.keys(ethicalQuestions).forEach(category => {
            if (!responsesByCategory[category]) {
              responsesByCategory[category] = {
                questions: {},
                score: 0
              }
            }
          })

          setAudit({
            ...data,
            ethical_assessment: responsesByCategory
          })
        }
      } catch (error) {
        console.error('Error fetching audit:', error)
        toast({
          title: "Error",
          description: "Failed to load audit details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAudit()
  }, [id, toast])

  // Add a new useEffect to fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!id) return
      const { data: reportData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('audit_id', id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reports:', error)
        return
      }

      setReports(reportData || [])
    }

    fetchReports()
  }, [id])

  // Update the audit state and track changes
  const updateAuditState = (updates: Partial<AuditState>) => {
    setAudit(prev => {
      if (!prev) return prev
      const newAudit = { ...prev, ...updates }
      setCurrentData(newAudit)
      debouncedSave(newAudit)
      return newAudit
    })
  }

  const handleQuestionnaireChange = async (category: string, questionId: string, value: number) => {
    if (!audit) return;

    console.log('Updating questionnaire response:', { category, questionId, value });

    try {
      // Initialize the category in local state if it doesn't exist
      const currentAssessment = {
        ...audit.ethical_assessment,
        [category]: audit.ethical_assessment[category] || {
          questions: {},
          score: 0
        }
      };

      const currentCategory = currentAssessment[category];
      const updatedQuestions = {
        ...currentCategory.questions,
        [questionId]: value
      };

      // Calculate new category score
      const totalPossible = Object.keys(ethicalQuestions[category as keyof typeof ethicalQuestions]).length * 5;
      const total = Object.values(updatedQuestions).reduce((sum, val) => sum + (val || 0), 0);
      const newCategoryScore = Math.round((total / totalPossible) * 100);

      // First, ensure the category exists in the database
      console.log('Ensuring category exists:', category);
      const { error: categoryError } = await supabase
        .from('ethical_assessment_categories')
        .upsert({
          audit_id: audit.id,
          category_name: category,
          score: newCategoryScore,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'audit_id,category_name'
        });

      if (categoryError) {
        console.error('Error upserting category:', categoryError);
        throw categoryError;
      }

      // Create or update the response
      console.log('Upserting response:', { audit_id: audit.id, category_name: category, question_id: questionId, response: value });
      const { error: responseError } = await supabase
        .from('ethical_assessment_responses')
        .upsert({
          audit_id: audit.id,
          category_name: category,
          question_id: questionId,
          response: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'audit_id,question_id'
        });

      if (responseError) {
        console.error('Error updating response:', responseError);
        throw responseError;
      }

      // Update the local state with new response and scores
      const updatedAssessment = {
        ...currentAssessment,
        [category]: {
          questions: updatedQuestions,
          score: newCategoryScore
        }
      };

      // Calculate new overall score
      const scores = Object.values(updatedAssessment).map(cat => cat.score);
      const validScores = scores.filter(score => score > 0);
      const newOverallScore = validScores.length > 0 
        ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
        : 0;

      // Update overall score in database
      console.log('Updating overall score:', newOverallScore);
      const { error: overallScoreError } = await supabase
        .from('audits')
        .update({ 
          overall_score: newOverallScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', audit.id);

      if (overallScoreError) {
        console.error('Error updating overall score:', overallScoreError);
        throw overallScoreError;
      }

      // Fetch the updated audit data to ensure UI is in sync with database
      const { data: updatedAudit, error: fetchError } = await supabase
        .from('audits')
        .select(`
          *,
          ethical_assessment_categories (*),
          ethical_assessment_responses (
            *,
            ethical_assessment_questions (*)
          )
        `)
        .eq('id', audit.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated audit:', fetchError);
        throw fetchError;
      }

      // Transform the fetched data into the expected format
      const responsesByCategory = updatedAudit.ethical_assessment_categories?.reduce((acc: AuditState['ethical_assessment'], category: EthicalAssessmentCategory) => {
        const responses = updatedAudit.ethical_assessment_responses?.filter(
          (response: EthicalAssessmentResponse) => response.category_name === category.category_name
        ) || [];
        
        acc[category.category_name] = {
          questions: responses.reduce((questions: Record<string, number>, response: EthicalAssessmentResponse) => ({
            ...questions,
            [response.question_id]: response.response || 0
          }), {}),
          score: category.score || 0
        };
        return acc;
      }, {} as AuditState['ethical_assessment']) || {};

      // Initialize empty categories if they don't exist
      Object.keys(ethicalQuestions).forEach(cat => {
        if (!responsesByCategory[cat]) {
          responsesByCategory[cat] = {
            questions: {},
            score: 0
          };
        }
      });

      // Update local state with transformed data
      setAudit({
        ...updatedAudit,
        ethical_assessment: responsesByCategory
      });
      setCurrentData({
        ...updatedAudit,
        ethical_assessment: responsesByCategory
      });
      setLastSaved(new Date());

      console.log('Successfully updated questionnaire response and scores');
    } catch (error) {
      console.error('Error in handleQuestionnaireChange:', error);
      toast({
        title: "Error",
        description: "Failed to save your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateCategoryScore = (
    questions: { [key: string]: number },
    newValue: number,
    changedQuestionId: string
  ) => {
    const updatedQuestions = { ...questions, [changedQuestionId]: newValue }
    const totalPossible = Object.keys(updatedQuestions).length * 5
    const total = Object.values(updatedQuestions).reduce((sum, val) => sum + val, 0)
    return Math.round((total / totalPossible) * 100)
  }

  const calculateOverallScore = (assessment: AuditState['ethical_assessment']) => {
    const scores = Object.values(assessment).map(category => category.score)
    const validScores = scores.filter(score => score > 0)
    return validScores.length > 0 
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateAuditState({ [name]: value })
  }

  // Manual save function for the save button
  const handleManualSave = async () => {
    if (!audit) return
    try {
      setIsSaving(true)
      await updateAudit(audit.id, audit)
      setLastSaved(new Date())
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateReport = async (data: {
    title: string
    description: string
    customInstructions: string
  }) => {
    try {
      setReportData(data)
      await generateReport('', {
        body: {
          auditId: id,
          ...data,
        },
      })
    } catch (error) {
      console.error('Error creating report:', error)
      let errorMessage = 'Failed to generate report. Please try again.'
      
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message)
          errorMessage = parsedError.error || errorMessage
        } catch {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      // Don't close the modal on error
      // setIsReportModalOpen(false)
    }
  }

  if (loading || !audit) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const calculateTotalScore = (auditData: AuditState) => {
    if (!auditData.ethical_assessment) return 0

    const scores = Object.values(auditData.ethical_assessment).map(category => category.score)
    const validScores = scores.filter(score => score > 0)
    return validScores.length > 0 
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 0
  }

  const navigationItems = [
    { id: "general", label: "General Information", icon: FileText },
    { id: "ethical-assessment", label: "Ethical Assessment", icon: ClipboardList },
    { id: "governance", label: "Governance & Monitoring", icon: Settings },
    { id: "staff-interviews", label: "Staff Interviews", icon: Users },
    { id: "raci", label: "RACI Matrix", icon: Network },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold tracking-tight">Audit Navigation</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                  <ChevronRight 
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                      activeTab === item.id ? "rotate-90 text-primary-foreground" : "text-muted-foreground"
                    )} 
                  />
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-16 items-center justify-between border-b bg-card/50">
          <div className="max-w-7xl w-full mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold tracking-tight">AI Ethics Audit for {audit.name ?? 'Untitled'}</h1>
              <Badge variant="outline" className="font-medium">
                {audit.status ?? 'In Progress'}
              </Badge>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">Overall Ethics Score</span>
                <span className={cn(
                  "mt-1 px-3 py-1 rounded-full text-sm font-medium",
                  (audit.overall_score ?? 0) >= 90 ? "bg-green-100 text-green-700" :
                  (audit.overall_score ?? 0) >= 70 ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {audit.overall_score ?? 0}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleManualSave} 
                  disabled={isSaving || !hasUnsavedChanges}
                  className="min-w-[120px]"
                  variant={hasUnsavedChanges ? "default" : "outline"}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {hasUnsavedChanges ? "Save Changes" : "Saved"}
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setIsReportModalOpen(true)}
                  variant="secondary"
                  className="min-w-[120px]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
                {lastSaved && (
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className={cn(
              activeTab === "general" ? "block" : "hidden",
              "space-y-6"
            )}>
              <div className="grid gap-6">
                <Card className="overflow-hidden border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="organization" className="text-base">Organization</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={audit.organization}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-base">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={audit.description ?? ''}
                        onChange={handleInputChange}
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className={cn(
              activeTab === "ethical-assessment" ? "block" : "hidden",
              "space-y-8"
            )}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(ethicalQuestions).map(([category, questions]) => {
                  const auditCategory = audit.ethical_assessment[category]
                  if (!auditCategory || typeof auditCategory !== 'object' || !('questions' in auditCategory)) {
                    return null
                  }
                  const score = auditCategory.score
                  return (
                    <Card key={category} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="border-b bg-card">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="capitalize">{category}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {ethicalRules[category as keyof typeof ethicalRules][0]}
                            </p>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-sm font-semibold",
                            score >= 90 ? "bg-green-100 text-green-700" :
                            score >= 70 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {Math.round(score)}%
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {ethicalRules[category as keyof typeof ethicalRules].slice(1).map((rule, index) => (
                            <div key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 bg-card/50">
                        <Questionnaire
                          categoryId={category}
                          questions={questions}
                          answers={auditCategory.questions}
                          onAnswerChange={(id, value) => handleQuestionnaireChange(category, id, value)}
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className={cn(
              activeTab === "governance" ? "block" : "hidden",
              "space-y-8"
            )}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Ethical Framework</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Define the ethical principles and guidelines that govern your AI system
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="ethical_framework"
                      name="ethical_framework"
                      value={audit.ethical_framework ?? ''}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Risks and Challenges</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Identify potential ethical risks and challenges in your AI implementation
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="risks_and_challenges"
                      name="risks_and_challenges"
                      value={audit.risks_and_challenges ?? ''}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Mitigation Strategies</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Outline strategies to address and mitigate identified risks
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="mitigation_strategies"
                      name="mitigation_strategies"
                      value={audit.mitigation_strategies ?? ''}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Continuous Monitoring</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Describe your approach to ongoing ethical oversight and monitoring
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="continuous_monitoring"
                      name="continuous_monitoring"
                      value={audit.continuous_monitoring ?? ''}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className={cn(
              activeTab === "staff-interviews" ? "block" : "hidden",
              "space-y-8"
            )}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <StaffInterviewLog 
                    auditId={audit.id}
                    initialInterviews={audit.staff_interviews || []}
                  />
                </CardContent>
              </Card>
            </div>

            <div className={cn(
              activeTab === "raci" ? "block" : "hidden",
              "space-y-8"
            )}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <RACIMatrix 
                    auditId={audit.id} 
                    initialMatrix={audit.raci_matrix || []} 
                  />
                </CardContent>
              </Card>
            </div>

            <div className={cn(
              activeTab === "reports" ? "block" : "hidden",
              "space-y-8"
            )}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Reports</CardTitle>
                    <Button 
                      onClick={() => setIsReportModalOpen(true)}
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create New Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {reports.length === 0 ? (
                    <div className="text-center py-8">
                      <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Reports Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Generate your first AI ethics audit report to get started.
                      </p>
                      <Button 
                        onClick={() => setIsReportModalOpen(true)}
                        variant="outline"
                      >
                        Create Report
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                            report.id === highlightedReportId
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-card hover:bg-accent/50"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <FileText className={cn(
                              "h-5 w-5 mt-1",
                              report.id === highlightedReportId ? "text-primary animate-pulse" : "text-primary"
                            )} />
                            <div>
                              <h4 className="font-medium">
                                {report.title}
                                {report.id === highlightedReportId && (
                                  <Badge variant="default" className="ml-2 bg-primary/10 text-primary">
                                    New
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {report.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  v{report.version}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Created {new Date(report.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/reports/${report.id}`)}
                          >
                            View Report
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
      <CreateReportModal
        auditId={id as string}
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        onSubmit={handleCreateReport}
        isGenerating={isGenerating}
        generatedContent={reportContent}
      />
    </div>
  )
}

