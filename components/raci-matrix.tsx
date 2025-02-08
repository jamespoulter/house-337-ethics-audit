import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roles = ["CEO", "CTO", "Head of HR", "Head of IT", "AI Ethics Officer", "Data Protection Officer"]
const responsibilities = [
  "Overall AI Ethics Strategy",
  "AI System Design and Development",
  "AI Risk Assessment",
  "AI Deployment and Monitoring",
  "AI Ethics Training",
  "Data Governance",
  "Ethical Use of AI",
]

type RACIValue = "R" | "A" | "C" | "I" | "-"

export function RACIMatrix() {
  const [matrix, setMatrix] = useState<Record<string, Record<string, RACIValue>>>(
    responsibilities.reduce(
      (acc, responsibility) => ({
        ...acc,
        [responsibility]: roles.reduce((roleAcc, role) => ({ ...roleAcc, [role]: "-" }), {}),
      }),
      {},
    ),
  )

  const handleChange = (responsibility: string, role: string, value: RACIValue) => {
    setMatrix((prevMatrix) => ({
      ...prevMatrix,
      [responsibility]: {
        ...prevMatrix[responsibility],
        [role]: value,
      },
    }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">RACI Matrix for AI Ethics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Responsibility / Role</TableHead>
            {roles.map((role) => (
              <TableHead key={role}>{role}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responsibilities.map((responsibility) => (
            <TableRow key={responsibility}>
              <TableCell>{responsibility}</TableCell>
              {roles.map((role) => (
                <TableCell key={role}>
                  <Select
                    value={matrix[responsibility][role]}
                    onValueChange={(value) => handleChange(responsibility, role, value as RACIValue)}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="R">R</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="I">I</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-sm">
        <p>
          <strong>R</strong> - Responsible: Does the work
        </p>
        <p>
          <strong>A</strong> - Accountable: Ultimately answerable for the correct and thorough completion of the task
        </p>
        <p>
          <strong>C</strong> - Consulted: Provides input or expertise
        </p>
        <p>
          <strong>I</strong> - Informed: Kept up-to-date on progress
        </p>
      </div>
    </div>
  )
}

