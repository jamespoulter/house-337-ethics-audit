import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface RACIEntry {
  id: string
  role: string
  responsibility: string
  assignment_type: 'R' | 'A' | 'C' | 'I'
}

interface RACITableProps {
  data: RACIEntry[]
}

const assignmentTypeColors = {
  R: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  A: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  I: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
}

const assignmentTypeLabels = {
  R: "Responsible",
  A: "Accountable",
  C: "Consulted",
  I: "Informed",
}

export function RACITable({ data }: RACITableProps) {
  // Group entries by role to create the matrix
  const roleMap = new Map<string, Map<string, string>>()
  const responsibilities = new Set<string>()

  // First pass: collect all unique roles and responsibilities
  data.forEach((entry) => {
    if (!roleMap.has(entry.role)) {
      roleMap.set(entry.role, new Map())
    }
    responsibilities.add(entry.responsibility)
  })

  // Second pass: fill in the matrix
  data.forEach((entry) => {
    const roleEntries = roleMap.get(entry.role)!
    roleEntries.set(entry.responsibility, entry.assignment_type)
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Role / Responsibility</TableHead>
            {Array.from(responsibilities).map((resp) => (
              <TableHead key={resp} className="min-w-[150px]">
                {resp}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(roleMap.entries()).map(([role, assignments]) => (
            <TableRow key={role}>
              <TableCell className="font-medium">{role}</TableCell>
              {Array.from(responsibilities).map((resp) => {
                const assignment = assignments.get(resp)
                return (
                  <TableCell key={`${role}-${resp}`}>
                    {assignment && (
                      <Badge 
                        variant="secondary"
                        className={`${assignmentTypeColors[assignment]} font-medium`}
                      >
                        {assignment} - {assignmentTypeLabels[assignment]}
                      </Badge>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t bg-muted/50">
        <div className="flex flex-wrap gap-3">
          {Object.entries(assignmentTypeLabels).map(([type, label]) => (
            <Badge 
              key={type}
              variant="secondary"
              className={`${assignmentTypeColors[type as keyof typeof assignmentTypeColors]} font-medium`}
            >
              {type} - {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
} 