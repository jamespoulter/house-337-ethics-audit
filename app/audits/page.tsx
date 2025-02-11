"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAudits, type Audit } from '@/lib/supabase'
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Audits() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
    }

    checkSession()
  }, [router, supabase.auth])

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const data = await getAudits()
        setAudits(data)
      } catch (error) {
        console.error('Error fetching audits:', error)
        toast({
          title: "Error",
          description: "Failed to load audits",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAudits()
  }, [toast])

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-500'
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Ethics Audits</h1>
        <Button asChild>
          <Link href="/audits/new">Start New Audit</Link>
        </Button>
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audits found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first AI ethics audit.</p>
          <Button asChild>
            <Link href="/audits/new">Create New Audit</Link>
          </Button>
        </div>
      ) : (
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
                <TableCell className="font-medium">{audit.name}</TableCell>
                <TableCell>{audit.organization}</TableCell>
                <TableCell>
                  <Badge variant={audit.status === "Completed" ? "default" : "secondary"}>
                    {audit.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {audit.overall_score ? (
                    <Badge className={getScoreColor(audit.overall_score)}>
                      {audit.overall_score}%
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not scored</Badge>
                  )}
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
      )}
    </div>
  )
}

