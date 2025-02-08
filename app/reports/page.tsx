import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Reports() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Ethics Audit Reports</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ethics Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View trends in ethics scores across all audits.</p>
            <Link href="/reports/ethics-score">
              <Button className="w-full">View Report</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Summary of compliance with ethical AI principles.</p>
            <Link href="/reports/compliance">
              <Button className="w-full">View Report</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Improvement Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Identify key areas for ethical improvement in AI systems.</p>
            <Link href="/reports/improvements">
              <Button className="w-full">View Report</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

