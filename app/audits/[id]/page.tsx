"use client"

import { useState } from "react"
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
import { ChevronRight, ClipboardList, Users, Network, FileText, Settings, BarChart } from "lucide-react"

interface Question {
  id: string
  question: string
}

interface AuditCategory {
  questions: Record<string, number>
  score: number
}

interface ChristianValues {
  humanDignity: AuditCategory
  stewardship: AuditCategory
  justice: AuditCategory
  compassion: AuditCategory
}

interface AuditData {
  id: string
  name: string
  organization: string
  description: string
  fairness: AuditCategory
  transparency: AuditCategory
  privacy: AuditCategory
  accountability: AuditCategory
  robustness: AuditCategory
  christianValues: ChristianValues
  biasAssessment: number
  dataGovernance: number
  ethicalFramework: string
  risksAndChallenges: string
  mitigationStrategies: string
  continuousMonitoring: string
}

type EthicalQuestions = {
  [K in keyof Omit<AuditData, "christianValues" | "id" | "name" | "organization" | "description" | "biasAssessment" | "dataGovernance" | "ethicalFramework" | "risksAndChallenges" | "mitigationStrategies" | "continuousMonitoring">]: Question[]
}

type ChristianValueQuestions = {
  [K in keyof ChristianValues]: Question[]
}

// Sample JSON data (updated with rules and questions)
const sampleAuditData = {
  id: "1",
  name: "AI Chatbot Ethics Audit",
  organization: "TechCorp Inc.",
  description: "Ethical assessment of our customer service AI chatbot",
  fairness: { questions: {}, score: 75 },
  transparency: { questions: {}, score: 60 },
  privacy: { questions: {}, score: 80 },
  accountability: { questions: {}, score: 70 },
  robustness: { questions: {}, score: 65 },
  christianValues: {
    humanDignity: { questions: {}, score: 85 },
    stewardship: { questions: {}, score: 70 },
    justice: { questions: {}, score: 75 },
    compassion: { questions: {}, score: 80 },
  },
  biasAssessment: 3,
  dataGovernance: 4,
  ethicalFramework:
    "We follow the IEEE Ethically Aligned Design principles and integrate Christian ethical considerations.",
  risksAndChallenges:
    "Potential biases in training data, privacy concerns with user data handling, transparency in decision-making processes.",
  mitigationStrategies:
    "Regular bias audits, implementing strong data protection measures, providing clear explanations of AI decision-making to users.",
  continuousMonitoring: "Monthly ethical reviews, ongoing user feedback collection, quarterly external audits.",
}

const ethicalRules = {
  fairness: [
    "Ensure equal treatment and outcomes across different demographic groups",
    "Regularly test for and mitigate algorithmic bias",
    "Provide mechanisms for users to report unfair treatment",
  ],
  transparency: [
    "Clearly communicate when users are interacting with AI",
    "Provide explanations for AI-driven decisions when possible",
    "Make the AI's capabilities and limitations publicly known",
  ],
  privacy: [
    "Collect only necessary data and obtain informed consent",
    "Implement strong data protection measures",
    "Allow users to access, correct, and delete their data",
  ],
  accountability: [
    "Establish clear lines of responsibility for AI actions",
    "Implement audit trails for AI decision-making",
    "Have a process for addressing and rectifying AI-related issues",
  ],
  robustness: [
    "Regularly test the AI system under various conditions",
    "Implement safeguards against adversarial attacks",
    "Ensure graceful degradation in case of system failures",
  ],
}

const christianValueRules = {
  humanDignity: [
    "Ensure the AI system respects the inherent worth of every individual",
    "Avoid dehumanizing interactions or decisions",
    "Promote user autonomy and informed decision-making",
  ],
  stewardship: [
    "Use AI responsibly to benefit humanity and the environment",
    "Consider long-term impacts of AI deployment",
    "Efficiently use computational resources to minimize environmental impact",
  ],
  justice: [
    "Ensure fair access to AI benefits across different communities",
    "Address and mitigate potential discriminatory outcomes",
    "Promote equitable distribution of risks and rewards from AI",
  ],
  compassion: [
    "Design AI to be empathetic and considerate in its interactions",
    "Implement safeguards to protect vulnerable users",
    "Use AI to actively support and assist those in need",
  ],
}

const ethicalQuestions = {
  fairness: [
    {
      id: "fairness-1",
      question: "Does the AI system treat all users equally regardless of their demographic characteristics?",
    },
    {
      id: "fairness-2",
      question: "Are there mechanisms in place to detect and mitigate bias in the AI's decision-making process?",
    },
    { id: "fairness-3", question: "Can users easily report unfair treatment or outcomes?" },
  ],
  transparency: [
    { id: "transparency-1", question: "Is it clear to users when they are interacting with an AI system?" },
    { id: "transparency-2", question: "Does the AI system provide explanations for its decisions when appropriate?" },
    {
      id: "transparency-3",
      question: "Is information about the AI system's capabilities and limitations publicly available?",
    },
  ],
  privacy: [
    { id: "privacy-1", question: "Is user data collected and processed with informed consent?" },
    { id: "privacy-2", question: "Are there strong data protection measures in place to safeguard user information?" },
    { id: "privacy-3", question: "Can users easily access, correct, or delete their personal data?" },
  ],
  accountability: [
    {
      id: "accountability-1",
      question: "Are there clear lines of responsibility for the AI system's actions and decisions?",
    },
    { id: "accountability-2", question: "Is there an audit trail for the AI's decision-making process?" },
    { id: "accountability-3", question: "Is there a defined process for addressing and rectifying AI-related issues?" },
  ],
  robustness: [
    {
      id: "robustness-1",
      question: "Is the AI system regularly tested under various conditions to ensure reliability?",
    },
    { id: "robustness-2", question: "Are there safeguards in place to protect against adversarial attacks?" },
    { id: "robustness-3", question: "Does the system degrade gracefully in case of failures or unexpected inputs?" },
  ],
}

const christianValueQuestions = {
  humanDignity: [
    {
      id: "humanDignity-1",
      question: "Does the AI system consistently respect the inherent worth of every individual?",
    },
    {
      id: "humanDignity-2",
      question: "Are there measures in place to prevent dehumanizing interactions or decisions?",
    },
    { id: "humanDignity-3", question: "Does the system promote user autonomy and informed decision-making?" },
  ],
  stewardship: [
    { id: "stewardship-1", question: "Is the AI system designed to benefit humanity and the environment?" },
    {
      id: "stewardship-2",
      question: "Are long-term impacts of AI deployment considered in the system's design and use?",
    },
    { id: "stewardship-3", question: "Are computational resources used efficiently to minimize environmental impact?" },
  ],
  justice: [
    {
      id: "justice-1",
      question: "Does the AI system ensure fair access to its benefits across different communities?",
    },
    { id: "justice-2", question: "Are there mechanisms to address and mitigate potential discriminatory outcomes?" },
    { id: "justice-3", question: "Does the system promote equitable distribution of risks and rewards?" },
  ],
  compassion: [
    { id: "compassion-1", question: "Is the AI system designed to be empathetic and considerate in its interactions?" },
    { id: "compassion-2", question: "Are there safeguards in place to protect vulnerable users?" },
    { id: "compassion-3", question: "Does the system actively support and assist those in need?" },
  ],
}

export default function AuditDetail() {
  const { id } = useParams()
  const { toast } = useToast()
  const [audit, setAudit] = useState<AuditData>(sampleAuditData)
  const [activeTab, setActiveTab] = useState("general")

  const calculateTotalScore = (auditData: AuditData) => {
    // Get scores from main categories
    const mainCategoryScores = [
      auditData.fairness.score,
      auditData.transparency.score,
      auditData.privacy.score,
      auditData.accountability.score,
      auditData.robustness.score,
    ]

    // Get scores from Christian values
    const christianValueScores = [
      auditData.christianValues.humanDignity.score,
      auditData.christianValues.stewardship.score,
      auditData.christianValues.justice.score,
      auditData.christianValues.compassion.score,
    ]

    // Calculate average of all scores
    const allScores = [...mainCategoryScores, ...christianValueScores]
    const totalScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length

    return Math.round(totalScore)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAudit((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuestionnaireChange = (category: keyof Omit<AuditData, "christianValues" | "id" | "name" | "organization" | "description" | "biasAssessment" | "dataGovernance" | "ethicalFramework" | "risksAndChallenges" | "mitigationStrategies" | "continuousMonitoring">, id: string, value: number) => {
    setAudit((prev) => {
      const categoryData = prev[category] as AuditCategory
      const updatedQuestions = {
        ...categoryData.questions,
        [id]: value,
      }
      
      // Calculate category score (out of 100)
      const score = (Object.values(updatedQuestions).reduce((sum, val) => sum + val, 0) / 
        (Object.keys(updatedQuestions).length * 5)) * 100

      const updatedAudit = {
        ...prev,
        [category]: {
          questions: updatedQuestions,
          score,
        },
      }

      // Update total score
      const totalScore = calculateTotalScore(updatedAudit)
      console.log(`Total Ethics Score: ${totalScore}%`)

      return updatedAudit
    })
  }

  const handleChristianValueChange = (category: keyof ChristianValues, id: string, value: number) => {
    setAudit((prev) => {
      const categoryData = prev.christianValues[category]
      const updatedQuestions = {
        ...categoryData.questions,
        [id]: value,
      }
      
      // Calculate category score (out of 100)
      const score = (Object.values(updatedQuestions).reduce((sum, val) => sum + val, 0) / 
        (Object.keys(updatedQuestions).length * 5)) * 100

      const updatedAudit = {
        ...prev,
        christianValues: {
          ...prev.christianValues,
          [category]: {
            questions: updatedQuestions,
            score,
          },
        },
      }

      // Update total score
      const totalScore = calculateTotalScore(updatedAudit)
      console.log(`Total Ethics Score: ${totalScore}%`)

      return updatedAudit
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Audit data:", audit)
    toast({
      title: "Audit Saved",
      description: "The AI ethics audit has been saved successfully.",
    })
  }

  const navigationItems = [
    { id: "general", label: "General Information", icon: FileText },
    { id: "ethical-assessment", label: "Ethical Assessment", icon: ClipboardList },
    { id: "christian-values", label: "Christian Values", icon: BarChart },
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
                calculateTotalScore(audit) >= 90 ? "bg-green-100 text-green-700" :
                calculateTotalScore(audit) >= 70 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              )}>
                {calculateTotalScore(audit)}%
              </span>
            </div>
            <Button type="submit" onClick={handleSubmit} size="lg">Save Audit</Button>
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
                  const auditCategory = audit[category as keyof typeof audit]
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
                          onAnswerChange={(id, value) => handleQuestionnaireChange(category as keyof Omit<AuditData, "christianValues" | "id" | "name" | "organization" | "description" | "biasAssessment" | "dataGovernance" | "ethicalFramework" | "risksAndChallenges" | "mitigationStrategies" | "continuousMonitoring">, id, value)}
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className={cn(
              activeTab === "christian-values" ? "block" : "hidden",
              "space-y-8"
            )}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(christianValueQuestions).map(([category, questions]) => {
                  const categoryData = audit.christianValues[category as keyof ChristianValues]
                  const score = categoryData.score
                  return (
                    <Card key={category} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="border-b bg-card">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {christianValueRules[category as keyof typeof christianValueRules][0]}
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
                          {christianValueRules[category as keyof typeof christianValueRules].slice(1).map((rule, index) => (
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
                          answers={categoryData.questions}
                          onAnswerChange={(id, value) => handleChristianValueChange(category as keyof ChristianValues, id, value)}
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
                  <StaffInterviewLog />
                </CardContent>
              </Card>
            </div>

            <div className={cn(
              activeTab === "raci" ? "block" : "hidden",
              "space-y-8"
            )}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <RACIMatrix />
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

