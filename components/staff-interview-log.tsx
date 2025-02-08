import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StaffMember {
  id: string
  name: string
  position: string
  interviewed: boolean
}

export function StaffInterviewLog() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: "1", name: "John Doe", position: "CEO", interviewed: false },
    { id: "2", name: "Jane Smith", position: "CTO", interviewed: false },
    { id: "3", name: "Alice Johnson", position: "Head of HR", interviewed: false },
    { id: "4", name: "Bob Brown", position: "Head of IT", interviewed: false },
  ])
  const [newStaff, setNewStaff] = useState({ name: "", position: "" })

  const handleCheckboxChange = (id: string) => {
    setStaffMembers(
      staffMembers.map((staff) => (staff.id === id ? { ...staff, interviewed: !staff.interviewed } : staff)),
    )
  }

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position) {
      setStaffMembers([
        ...staffMembers,
        {
          id: Date.now().toString(),
          ...newStaff,
          interviewed: false,
        },
      ])
      setNewStaff({ name: "", position: "" })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Staff Interview Log</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Interviewed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>{staff.name}</TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>
                <Checkbox checked={staff.interviewed} onCheckedChange={() => handleCheckboxChange(staff.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex space-x-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="position">Position</Label>
          <Input
            type="text"
            id="position"
            value={newStaff.position}
            onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
          />
        </div>
        <Button onClick={handleAddStaff} className="mt-auto">
          Add Staff
        </Button>
      </div>
    </div>
  )
}

