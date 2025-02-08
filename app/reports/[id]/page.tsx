import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  // TODO: Replace with actual data fetching
  const reportTypes = {
    "ethics-score": {
      title: "Ethics Score Trends",
      description: "Detailed analysis of ethics score trends across all audits."
    },
    "compliance": {
      title: "Compliance Summary",
      description: "Comprehensive summary of compliance with ethical AI principles."
    },
    "improvements": {
      title: "Improvement Areas",
      description: "Detailed analysis of key areas for ethical improvement in AI systems."
    }
  }

  const report = reportTypes[params.id as keyof typeof reportTypes]

  if (!report) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{report.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{report.description}</p>
          <div className="mt-6">
            {/* Report content will be dynamically loaded here */}
            <p>Report content is being generated...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 