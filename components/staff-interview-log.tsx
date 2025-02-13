import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createInterview, updateInterview, deleteInterview } from "@/lib/supabase"
import { StaffInterview } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Edit2, Trash2, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

interface StaffInterviewLogProps {
  auditId: string
  initialInterviews?: StaffInterview[]
  onReportProgress?: (data: string) => void
}

interface EditDialogProps {
  interview: StaffInterview
  onSave: (updatedInterview: Partial<StaffInterview>) => Promise<void>
  onDelete: () => Promise<void>
  isLoading: boolean
}

function EditInterviewDialog({ interview, onSave, onDelete, isLoading }: EditDialogProps) {
  const [editedInterview, setEditedInterview] = useState({
    staff_name: interview.staff_name,
    position: interview.position,
    notes: interview.notes || "",
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = async () => {
    await onSave(editedInterview)
    setIsOpen(false)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      await onDelete()
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Interview Details</DialogTitle>
          <DialogDescription>
            Update the staff member's information and interview notes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedInterview.staff_name}
              onChange={(e) =>
                setEditedInterview({ ...editedInterview, staff_name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <Input
              id="position"
              value={editedInterview.position}
              onChange={(e) =>
                setEditedInterview({ ...editedInterview, position: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={editedInterview.notes}
              onChange={(e) =>
                setEditedInterview({ ...editedInterview, notes: e.target.value })
              }
              className="col-span-3"
              rows={4}
            />
          </div>
          {interview.interview_date && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Interviewed</Label>
              <div className="col-span-3 text-sm text-muted-foreground">
                {format(new Date(interview.interview_date), "PPP 'at' p")}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function StaffInterviewLog({ 
  auditId, 
  initialInterviews = [], 
  onReportProgress = () => {}
}: StaffInterviewLogProps) {
  const [staffMembers, setStaffMembers] = useState<StaffInterview[]>(initialInterviews)
  const [newStaff, setNewStaff] = useState({ staff_name: "", position: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setStaffMembers(initialInterviews)
  }, [initialInterviews])

  const handleCheckboxChange = async (interview: StaffInterview) => {
    try {
      setIsLoading(true)
      const updatedInterview = await updateInterview(interview.id, {
        ...interview,
        interview_date: interview.interview_date ? null : new Date().toISOString(),
      })

      if (updatedInterview) {
        setStaffMembers((prev) =>
          prev.map((staff) => (staff.id === interview.id ? updatedInterview : staff))
        )
        toast({
          title: "Interview status updated",
          description: updatedInterview.interview_date
            ? `Marked ${updatedInterview.staff_name} as interviewed`
            : `Unmarked ${updatedInterview.staff_name} as interviewed`,
        })
      }
    } catch (error) {
      console.error("Error updating interview:", error)
      toast({
        title: "Error",
        description: "Failed to update interview status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateInterview = async (interview: StaffInterview, updates: Partial<StaffInterview>) => {
    try {
      setIsLoading(true)
      const updatedInterview = await updateInterview(interview.id, {
        ...interview,
        ...updates,
      })

      if (updatedInterview) {
        setStaffMembers((prev) =>
          prev.map((staff) => (staff.id === interview.id ? updatedInterview : staff))
        )
        toast({
          title: "Interview updated",
          description: "Interview details have been updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating interview:", error)
      toast({
        title: "Error",
        description: "Failed to update interview details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteInterview = async (interview: StaffInterview) => {
    try {
      setIsLoading(true)
      await deleteInterview(interview.id)
      setStaffMembers((prev) => prev.filter((staff) => staff.id !== interview.id))
      toast({
        title: "Interview deleted",
        description: "Interview has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting interview:", error)
      toast({
        title: "Error",
        description: "Failed to delete interview",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = async () => {
    if (!auditId) {
      toast({
        title: "Error",
        description: "No audit ID provided",
        variant: "destructive",
      })
      return
    }

    if (newStaff.staff_name && newStaff.position) {
      try {
        setIsLoading(true)
        const interview = await createInterview({
          audit_id: auditId,
          staff_name: newStaff.staff_name,
          position: newStaff.position,
          interview_date: null,
          notes: null,
        })

        if (interview) {
          setStaffMembers((prev) => [...prev, interview])
          setNewStaff({ staff_name: "", position: "" })
          toast({
            title: "Staff member added",
            description: `${interview.staff_name} has been added to the interview list.`,
          })
        }
      } catch (error) {
        console.error("Error adding staff member:", error)
        toast({
          title: "Error",
          description: "Failed to add staff member. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Missing information",
        description: "Please provide both name and position.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddStaff()
    }
  }

  const handleCreateReport = async (data: {
    title: string
    description: string
    customInstructions: string
  }) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditId: auditId,
          ...data
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start report generation')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Failed to initialize stream reader')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            onReportProgress(data)
          }
        }
      }
    } catch (error) {
      console.error('Error in report generation:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Staff Interview Log</h2>
        <Button onClick={() => window.print()} variant="outline">
          Export Log
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Interview Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.staff_name}</TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!staff.interview_date}
                    onCheckedChange={() => handleCheckboxChange(staff)}
                    disabled={isLoading}
                  />
                  {staff.interview_date && (
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(staff.interview_date), "PP")}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {staff.notes || "No notes"}
              </TableCell>
              <TableCell>
                <EditInterviewDialog
                  interview={staff}
                  onSave={(updates) => handleUpdateInterview(staff, updates)}
                  onDelete={() => handleDeleteInterview(staff)}
                  isLoading={isLoading}
                />
              </TableCell>
            </TableRow>
          ))}
          {staffMembers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No staff members added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex space-x-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={newStaff.staff_name}
            onChange={(e) => setNewStaff({ ...newStaff, staff_name: e.target.value })}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="position">Position</Label>
          <Input
            type="text"
            id="position"
            value={newStaff.position}
            onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={handleAddStaff}
          className="mt-auto"
          disabled={isLoading || !newStaff.staff_name || !newStaff.position}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Staff"
          )}
        </Button>
      </div>
    </div>
  )
}

