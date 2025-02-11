import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createInterview, updateInterview } from "@/lib/supabase"
import { StaffInterview } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface StaffInterviewLogProps {
  auditId: string
  initialInterviews?: StaffInterview[]
}

export function StaffInterviewLog({ auditId, initialInterviews = [] }: StaffInterviewLogProps) {
  const [staffMembers, setStaffMembers] = useState<StaffInterview[]>(initialInterviews)
  const [newStaff, setNewStaff] = useState({ staff_name: "", position: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Debug log when props change
  useEffect(() => {
    console.log('Staff Interview Log Props:', { auditId, initialInterviews })
  }, [auditId, initialInterviews])

  const handleCheckboxChange = async (interview: StaffInterview) => {
    try {
      setIsLoading(true)
      console.log('Updating interview:', interview)
      
      const updatedInterview = await updateInterview(interview.id, {
        ...interview,
        interview_date: interview.interview_date ? null : new Date().toISOString()
      })
      
      console.log('Interview updated:', updatedInterview)
      
      if (updatedInterview) {
        setStaffMembers(prev => 
          prev.map(staff => staff.id === interview.id ? updatedInterview : staff)
        )
        toast({
          title: "Interview status updated",
          description: updatedInterview.interview_date 
            ? `Marked ${updatedInterview.staff_name} as interviewed`
            : `Unmarked ${updatedInterview.staff_name} as interviewed`,
        })
      }
    } catch (error) {
      console.error('Error updating interview:', error)
      toast({
        title: "Error",
        description: "Failed to update interview status",
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
        console.log('Adding new staff member:', { ...newStaff, audit_id: auditId })
        
        const interview = await createInterview({
          audit_id: auditId,
          staff_name: newStaff.staff_name,
          position: newStaff.position,
          interview_date: null,
          notes: null
        })

        console.log('Staff member added:', interview)
        
        if (interview) {
          setStaffMembers(prev => [...prev, interview])
          setNewStaff({ staff_name: "", position: "" })
          toast({
            title: "Staff member added",
            description: `${interview.staff_name} has been added to the interview list.`,
          })
        }
      } catch (error) {
        console.error('Error adding staff member:', error)
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
    if (e.key === 'Enter') {
      handleAddStaff()
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
              <TableCell>{staff.staff_name}</TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>
                <Checkbox 
                  checked={!!staff.interview_date}
                  onCheckedChange={() => handleCheckboxChange(staff)}
                  disabled={isLoading}
                />
              </TableCell>
            </TableRow>
          ))}
          {staffMembers.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
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
            'Add Staff'
          )}
        </Button>
      </div>
    </div>
  )
}

