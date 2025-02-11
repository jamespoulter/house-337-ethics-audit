import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAuditsByOrganization } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'draft':
      return 'outline'
    default:
      return 'secondary'
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "bg-green-500"
  if (score >= 70) return "bg-yellow-500"
  if (score > 0) return "bg-red-500"
  return "bg-gray-500"
}

async function AuditsTable() {
  try {
    const audits = await getAuditsByOrganization()

    if (!audits?.length) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No audits found. Create your first audit to get started.</p>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Audit Name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell className="font-medium">{audit.title}</TableCell>
              <TableCell>{audit.organization}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(audit.status)}>{audit.status}</Badge>
              </TableCell>
              <TableCell>{audit.created_by?.full_name || audit.created_by?.email}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/audits/${audit.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load audits. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }
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

      <div className="space-y-4">
        <Suspense
          fallback={
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          }
        >
          <AuditsTable />
        </Suspense>
      </div>
    </div>
  )
}

