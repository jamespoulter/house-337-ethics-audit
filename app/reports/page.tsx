import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartBar, ShieldCheck, Target } from "lucide-react"

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Ethics Audit Reports</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive reports and analytics from your AI ethics audits
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChartBar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Ethics Score Trends</CardTitle>
                <CardDescription className="mt-1.5">
                  Track progress over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">View trends in ethics scores across all audits and monitor improvements in your AI systems.</p>
            <Link href="/reports/ethics-score" className="block">
              <Button className="w-full">View Report</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Compliance Summary</CardTitle>
                <CardDescription className="mt-1.5">
                  Ethical principles adherence
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Summary of compliance with ethical AI principles and guidelines across your organization.</p>
            <Link href="/reports/compliance" className="block">
              <Button className="w-full">View Report</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Improvement Areas</CardTitle>
                <CardDescription className="mt-1.5">
                  Action points and recommendations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Identify key areas for ethical improvement in AI systems and get actionable recommendations.</p>
            <Link href="/reports/improvements" className="block">
              <Button className="w-full">View Report</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

