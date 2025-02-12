import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getServerSupabase } from "@/lib/supabase-server"
import { CalendarDays, CheckCircle, Clock, FileText } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  try {
    // Get the current user's session
    const supabase = getServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            Please log in to view your dashboard
          </div>
        </div>
      )
    }

    // Fetch audits and log the raw data
    const { data: audits, error, count } = await supabase
      .from('audits')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching audits:', error)
      throw error
    }

    console.log('Raw audits data:', audits)
    console.log('Total count:', count)

    // Debug: Log the structure of the first audit if it exists
    if (audits.length > 0) {
      console.log('First audit structure:', {
        keys: Object.keys(audits[0]),
        sample: audits[0]
      })
    }

    // No need to filter by user since the query already does that
    const validStatuses = ['in_progress', 'completed']
    const invalidStatusAudits = audits.filter(audit => !validStatuses.includes(audit.status))
    if (invalidStatusAudits.length > 0) {
      console.warn('Found audits with invalid status:', invalidStatusAudits)
    }

    // Calculate and log dashboard metrics with detailed information
    const totalAudits = audits.length
    console.log('Total audits:', totalAudits, 'All audit IDs:', audits.map(a => a.id))

    const ongoingAudits = audits.filter(audit => audit.status === 'in_progress').length
    console.log('Ongoing audits:', {
      count: ongoingAudits,
      details: audits
        .filter(audit => audit.status === 'in_progress')
        .map(a => ({
          id: a.id,
          name: a.name,
          created: a.created_at,
          updated: a.updated_at
        }))
    })

    const completedAudits = audits.filter(audit => audit.status === 'completed').length
    console.log('Completed audits:', {
      count: completedAudits,
      details: audits
        .filter(audit => audit.status === 'completed')
        .map(a => ({
          id: a.id,
          name: a.name,
          created: a.created_at,
          updated: a.updated_at
        }))
    })
    
    // Calculate and log average ethics score
    const completedAuditsWithScores = audits.filter(
      audit => audit.status === 'completed' && audit.overall_score !== null
    )
    console.log('Completed audits with scores:', completedAuditsWithScores.map(a => ({
      id: a.id,
      name: a.name,
      score: a.overall_score
    })))

    const averageScore = completedAuditsWithScores.length > 0
      ? completedAuditsWithScores.reduce((acc, audit) => acc + (audit.overall_score || 0), 0) / completedAuditsWithScores.length
      : 0
    
    console.log('Average score calculation:', {
      totalScore: completedAuditsWithScores.reduce((acc, audit) => acc + (audit.overall_score || 0), 0),
      numberOfAudits: completedAuditsWithScores.length,
      averageScore: averageScore
    })

    // Get recent and ongoing audits
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentAudits = audits
      .filter(audit => {
        const lastEditDate = new Date(audit.updated_at || audit.created_at)
        return audit.status === 'in_progress' || lastEditDate >= thirtyDaysAgo
      })
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at)
        const dateB = new Date(b.updated_at || b.created_at)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 5)

    console.log('Recent audits:', recentAudits.map(a => ({
      id: a.id,
      name: a.name,
      status: a.status,
      lastUpdate: a.updated_at || a.created_at
    })))

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Ethics Audit Dashboard</h1>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/audits/new">Start New Audit</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Audits</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalAudits}
                {totalAudits === 0 && <span className="text-sm text-gray-500 block">No audits found</span>}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ongoing Audits</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {ongoingAudits}
                {ongoingAudits === 0 && <span className="text-sm text-gray-500 block">No ongoing audits</span>}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Audits</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {completedAudits}
                {completedAudits === 0 && <span className="text-sm text-gray-500 block">No completed audits</span>}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Ethics Score</CardTitle>
              <div className="text-2xl font-bold text-blue-600">
                {averageScore > 0 ? `${Math.round(averageScore)}%` : '-'}
              </div>
            </CardHeader>
            <CardContent>
              {averageScore > 0 ? (
                <Progress value={averageScore} className="h-2" />
              ) : (
                <div className="text-sm text-gray-500">No scores available</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent & Ongoing Audits</CardTitle>
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentAudits.length > 0 ? (
                recentAudits.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        audit.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{audit.name}</span>
                        <span className="text-sm text-gray-500">
                          {audit.organization} • Last updated: {new Date(audit.updated_at || audit.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4" asChild>
                      <Link href={`/audits/${audit.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No recent audits found. Start a new audit to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error in Dashboard:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading dashboard data. Please try refreshing the page.
        </div>
      </div>
    )
  }
}

