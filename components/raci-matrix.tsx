import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { RACIMatrix as RACIMatrixType } from "@/lib/types"
import { supabase } from "@/lib/supabase"

const roles = [
  "CEO",
  "CTO",
  "Chief Ethics Officer",
  "Head of AI Development",
  "Data Protection Officer",
  "Legal Counsel",
  "Diversity & Inclusion Lead",
  "User Experience Lead"
]

interface ResponsibilityCategory {
  name: string
  subcategories: {
    name: string
    responsibilities: string[]
  }[]
}

const responsibilityCategories: ResponsibilityCategory[] = [
  {
    name: "Transparency",
    subcategories: [
      {
        name: "Decision Making",
        responsibilities: [
          "AI Decision Documentation",
          "Algorithm Explainability",
          "User Communication Strategy"
        ]
      },
      {
        name: "Data Usage",
        responsibilities: [
          "Data Collection Transparency",
          "Usage Reporting",
          "Public Documentation"
        ]
      }
    ]
  },
  {
    name: "Privacy",
    subcategories: [
      {
        name: "Data Protection",
        responsibilities: [
          "Security Implementation",
          "Access Controls",
          "Data Encryption"
        ]
      },
      {
        name: "User Rights",
        responsibilities: [
          "Consent Management",
          "Data Access Requests",
          "Right to be Forgotten"
        ]
      }
    ]
  },
  {
    name: "Inclusivity",
    subcategories: [
      {
        name: "Accessibility",
        responsibilities: [
          "Interface Design",
          "Assistive Technology",
          "Language Support"
        ]
      },
      {
        name: "Bias Prevention",
        responsibilities: [
          "Dataset Diversity",
          "Testing Protocols",
          "Mitigation Strategies"
        ]
      }
    ]
  },
  {
    name: "Accountability",
    subcategories: [
      {
        name: "Governance",
        responsibilities: [
          "Policy Development",
          "Role Assignment",
          "Performance Monitoring"
        ]
      },
      {
        name: "Incident Management",
        responsibilities: [
          "Response Procedures",
          "Investigation Process",
          "Remediation Actions"
        ]
      }
    ]
  },
  {
    name: "Sustainability",
    subcategories: [
      {
        name: "Environmental",
        responsibilities: [
          "Resource Optimization",
          "Energy Efficiency",
          "Impact Measurement"
        ]
      },
      {
        name: "Social",
        responsibilities: [
          "Community Impact",
          "Workforce Development",
          "Stakeholder Engagement"
        ]
      }
    ]
  }
]

type RACIValue = 'R' | 'A' | 'C' | 'I' | 'none' | null

interface RACIMatrixProps {
  auditId: string
  initialMatrix?: RACIMatrixType[]
}

export function RACIMatrix({ auditId, initialMatrix = [] }: RACIMatrixProps) {
  const { toast } = useToast()
  const [matrix, setMatrix] = useState<Record<string, Record<string, RACIValue>>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Transform initial matrix data into the required format
  useEffect(() => {
    const transformedMatrix: Record<string, Record<string, RACIValue>> = {}
    initialMatrix.forEach((item) => {
      if (!transformedMatrix[item.responsibility]) {
        transformedMatrix[item.responsibility] = {}
      }
      transformedMatrix[item.responsibility][item.role] = item.assignment_type
    })
    setMatrix(transformedMatrix)
  }, [initialMatrix])

  const handleChange = async (responsibility: string, role: string, value: RACIValue) => {
    if (value === 'none') {
      // Handle clearing the selection
      setMatrix((prevMatrix) => ({
        ...prevMatrix,
        [responsibility]: {
          ...prevMatrix[responsibility],
          [role]: null,
        },
      }))
      return
    }

    if (!value) return // Don't save if value is null/empty

    // Find existing entry in initialMatrix
    const existingEntry = initialMatrix.find(
      item => item.responsibility === responsibility && item.role === role
    )

    try {
      setIsLoading(true)
      console.log('Updating RACI matrix:', { responsibility, role, value })

      // Update local state immediately for better UX
      setMatrix((prevMatrix) => ({
        ...prevMatrix,
        [responsibility]: {
          ...prevMatrix[responsibility],
          [role]: value,
        },
      }))

      // Prepare data for Supabase
      const raciData = {
        audit_id: auditId,
        role,
        responsibility,
        assignment_type: value
      }

      let result
      if (existingEntry) {
        // Update existing entry
        console.log('Updating existing entry:', existingEntry.id)
        const { data, error } = await supabase
          .from('raci_matrix')
          .update(raciData)
          .eq('id', existingEntry.id)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Create new entry
        console.log('Creating new entry')
        const { data, error } = await supabase
          .from('raci_matrix')
          .insert([raciData])
          .select()
          .single()

        if (error) throw error
        result = data
      }

      console.log('RACI update successful:', result)
      toast({
        title: "Updated",
        description: `Updated ${role}'s responsibility for ${responsibility}`,
      })

    } catch (error) {
      console.error('Error updating RACI matrix:', error)
      toast({
        title: "Error",
        description: "Failed to update RACI matrix. Please try again.",
        variant: "destructive",
      })
      // Revert local state on error
      if (existingEntry) {
        setMatrix((prevMatrix) => ({
          ...prevMatrix,
          [responsibility]: {
            ...prevMatrix[responsibility],
            [role]: existingEntry.assignment_type,
          },
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">RACI Matrix for Trustworthy AI Implementation</h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {responsibilityCategories.map((category) => (
          <AccordionItem key={category.name} value={category.name} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <h3 className="text-xl font-semibold">{category.name}</h3>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.name} className="mb-8 last:mb-0">
                  <h4 className="text-lg font-medium mb-4">{subcategory.name}</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Responsibility</TableHead>
                        {roles.map((role) => (
                          <TableHead key={role} className="text-center">{role}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subcategory.responsibilities.map((responsibility) => (
                        <TableRow key={responsibility}>
                          <TableCell className="font-medium">{responsibility}</TableCell>
                          {roles.map((role) => (
                            <TableCell key={role} className="text-center">
                              <Select
                                value={matrix[responsibility]?.[role] || 'none'}
                                onValueChange={(value) => handleChange(responsibility, role, value as RACIValue)}
                                disabled={isLoading}
                              >
                                <SelectTrigger className="w-[80px] mx-auto">
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  <SelectItem value="R">R</SelectItem>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="I">I</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold">RACI Legend</h4>
        <div className="text-sm space-y-1">
          <p>
            <strong>R</strong> - Responsible: Does the work
          </p>
          <p>
            <strong>A</strong> - Accountable: Ultimately answerable for the correct completion
          </p>
          <p>
            <strong>C</strong> - Consulted: Provides input or expertise
          </p>
          <p>
            <strong>I</strong> - Informed: Kept up-to-date on progress
          </p>
        </div>
      </div>
    </div>
  )
}

