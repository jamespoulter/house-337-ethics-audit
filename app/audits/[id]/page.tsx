"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
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
import { ChevronRight, ClipboardList, Users, Network, FileText, Settings, BarChart, Loader2, Save } from "lucide-react"
import { getAuditById, updateAudit } from "@/lib/supabase"
import { AuditWithDetails, EthicalAssessmentCategory, EthicalAssessmentResponse } from "@/lib/types"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import debounce from "lodash/debounce"

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
    { id: "transparency-1", question: "Does the system provide clear explanations of how it makes decisions?" },
    { id: "transparency-2", question: "Are users informed about what data is collected and how it's used?" },
    { id: "transparency-3", question: "Is there clear communication about the AI system's capabilities and limitations?" },
    { id: "transparency-4", question: "Are algorithmic processes documented and explainable to users?" },
  ],
  privacy: [
    { id: "privacy-1", question: "Is data collection limited to stated purposes only?" },
    { id: "privacy-2", question: "Are there robust measures to protect user data?" },
    { id: "privacy-3", question: "Can users access, modify, or delete their personal data?" },
    { id: "privacy-4", question: "Is data handling compliant with privacy regulations?" },
  ],
  inclusivity: [
    { id: "inclusivity-1", question: "Is the AI system tested across diverse user groups?" },
    { id: "inclusivity-2", question: "Are accessibility features built into the system?" },
    { id: "inclusivity-3", question: "Is there regular testing for bias against underrepresented groups?" },
    { id: "inclusivity-4", question: "Does the system accommodate different languages and cultural contexts?" },
  ],
  accountability: [
    { id: "accountability-1", question: "Are there clear lines of responsibility for AI decisions?" },
    { id: "accountability-2", question: "Is there a comprehensive audit trail for AI actions?" },
    { id: "accountability-3", question: "Are there mechanisms for users to challenge AI decisions?" },
    { id: "accountability-4", question: "Is there a clear process for handling AI-related incidents?" },
  ],
  sustainability: [
    { id: "sustainability-1", question: "Is the economic impact of the AI system assessed?" },
    { id: "sustainability-2", question: "Are social consequences evaluated and monitored?" },
    { id: "sustainability-3", question: "Is energy efficiency considered in system design?" },
    { id: "sustainability-4", question: "Are there measures to reduce environmental impact?" },
  ],
  complianceAndGovernance: [
    { id: "compliance-1", question: "Does the system comply with relevant AI regulations?" },
    { id: "compliance-2", question: "Is there a documented ethical governance framework?" },
    { id: "compliance-3", question: "Are compliance records maintained and updated?" },
    { id: "compliance-4", question: "Is there regular review of compliance requirements?" },
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
              response => response.category_id === category.id
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

  const handleQuestionnaireChange = (category: string, questionId: string, value: number) => {
    updateAuditState({
      ethical_assessment_responses: [
        ...(audit?.ethical_assessment_responses || []).filter(
          response => response.question_id !== questionId
        ),
        {
          id: `${audit?.id}-${questionId}`,
          category_id: category,
          question_id: questionId,
          response: value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    })
  }

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
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Audit Navigation</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                  <ChevronRight className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    activeTab === item.id ? "rotate-90" : ""
                  )} />
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-16 items-center justify-between border-b px-8">
          <h1 className="text-xl font-semibold">AI Ethics Audit for {audit.name}</h1>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground mb-1">Overall Ethics Score</span>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold",
                audit.overall_score >= 90 ? "bg-green-100 text-green-700" :
                audit.overall_score >= 70 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              )}>
                {audit.overall_score || 0}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleManualSave} 
                disabled={isSaving || !hasUnsavedChanges}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Audit
                  </>
                )}
              </Button>
              {lastSaved && (
                <p className="text-sm text-muted-foreground">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
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
                        value={audit.description}
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
                      id="ethicalFramework"
                      name="ethicalFramework"
                      value={audit.ethicalFramework}
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
                      id="risksAndChallenges"
                      name="risksAndChallenges"
                      value={audit.risksAndChallenges}
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
                      id="mitigationStrategies"
                      name="mitigationStrategies"
                      value={audit.mitigationStrategies}
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
                      id="continuousMonitoring"
                      name="continuousMonitoring"
                      value={audit.continuousMonitoring}
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
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

