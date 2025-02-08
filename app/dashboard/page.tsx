import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">AI Ethics Audit Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Ethics Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["AI Chatbot", "Recommendation System", "Facial Recognition"].map((audit, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{audit}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/audits/${index + 1}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ethical Principles Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Fairness", "Transparency", "Privacy", "Accountability", "Christian Values"].map((principle, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{principle}</span>
                    <span>{75 + index * 5}%</span>
                  </div>
                  <Progress value={75 + index * 5} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/audits/new">Start New Audit</Link>
        </Button>
      </div>
    </div>
  )
}

