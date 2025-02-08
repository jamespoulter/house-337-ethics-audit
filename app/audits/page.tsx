import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const audits = [
  { id: 1, name: "AI Chatbot", organization: "TechCorp Inc.", status: "In Progress", overallScore: 75 },
  { id: 2, name: "Recommendation System", organization: "E-commerce Inc", status: "Completed", overallScore: 88 },
  { id: 3, name: "Facial Recognition", organization: "Security Ltd", status: "In Progress", overallScore: 62 },
  { id: 4, name: "Automated Decision System", organization: "Finance Co", status: "Completed", overallScore: 91 },
  { id: 5, name: "Natural Language Processor", organization: "AI Research", status: "Not Started", overallScore: 0 },
]

function getScoreColor(score: number) {
  if (score >= 90) return "bg-green-500"
  if (score >= 70) return "bg-yellow-500"
  if (score > 0) return "bg-red-500"
  return "bg-gray-500"
}

export default function Audits() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Ethics Audits</h1>
        <Button asChild>
          <Link href="/audits/new">Start New Audit</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Audit Name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Overall Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell>{audit.name}</TableCell>
              <TableCell>{audit.organization}</TableCell>
              <TableCell>
                <Badge variant={audit.status === "Completed" ? "default" : "secondary"}>{audit.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getScoreColor(audit.overallScore)}>{audit.overallScore}%</Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/audits/${audit.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

