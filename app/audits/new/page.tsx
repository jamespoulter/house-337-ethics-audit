"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function NewAudit() {
  const [auditData, setAuditData] = useState({
    name: "",
    organization: "",
    description: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAuditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("New Audit Data:", auditData)
    toast({
      title: "Audit Created",
      description: "Your new AI ethics audit has been created successfully.",
    })
    router.push("/audits")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Start New AI Ethics Audit</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="name">Audit Name</Label>
          <Input id="name" name="name" value={auditData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            name="organization"
            value={auditData.organization}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={auditData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Create Audit</Button>
      </form>
    </div>
  )
}

