"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Report } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MarkdownContent } from "@/components/ui/markdown-content"
import { RACITable } from "@/components/ui/raci-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReportWithAudit extends Report {
  audit_id: string
  audit?: {
    id: string
    raci_matrix: Array<{
      id: string
      role: string
      responsibility: string
      assignment_type: 'R' | 'A' | 'C' | 'I'
    }>
  }
}

export default function ReportView() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [report, setReport] = useState<ReportWithAudit | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // First fetch the report to get the audit_id
        const { data: reportData, error: reportError } = await supabase
          .from("reports")
          .select("*, audit:audit_id (*)")
          .eq("id", id)
          .single()

        if (reportError) throw reportError

        if (reportData?.audit_id) {
          // Then fetch the RACI matrix data for this audit
          const { data: raciData, error: raciError } = await supabase
            .from("raci_matrix")
            .select("*")
            .eq("audit_id", reportData.audit_id)

          if (raciError) throw raciError

          // Combine the data
          setReport({
            ...reportData,
            audit: {
              id: reportData.audit_id,
              raci_matrix: raciData || []
            }
          })
        } else {
          setReport(reportData)
        }
      } catch (error) {
        console.error("Error fetching report:", error)
        toast({
          title: "Error",
          description: "Failed to load report. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id, supabase, toast])

  const handleDownload = () => {
    if (!report) return

    const element = document.createElement("a")
    const file = new Blob([report.content], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `${report.title.toLowerCase().replace(/\s+/g, "-")}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The report you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const hasRaciData = report.audit?.raci_matrix && report.audit.raci_matrix.length > 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <p className="text-muted-foreground">{report.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            v{report.version}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card className="p-8">
        <Tabs defaultValue="report" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="report">Report Content</TabsTrigger>
            <TabsTrigger value="raci" disabled={!hasRaciData}>
              RACI Matrix {!hasRaciData && "(Not Available)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <MarkdownContent content={report.content} />
              </article>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="raci" className="mt-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert">
                  <h2>RACI Matrix</h2>
                  <p>
                    This matrix shows the roles and responsibilities for different aspects of the AI ethics implementation.
                    Each cell indicates whether a role is Responsible (R), Accountable (A), Consulted (C), or Informed (I)
                    for a particular responsibility.
                  </p>
                </div>
                {hasRaciData ? (
                  <RACITable data={report.audit.raci_matrix} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>No RACI matrix data available for this report.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 