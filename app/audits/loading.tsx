import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

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
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 