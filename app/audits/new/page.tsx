"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createAudit } from "@/lib/supabase"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function NewAudit() {
  const [auditData, setAuditData] = useState({
    name: "",
    organization: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      console.log('Session found:', session.user)
    }

    checkSession()
  }, [router, supabase.auth])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAuditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create an audit",
          variant: "destructive",
        })
        router.push('/auth/login')
        return
      }

      console.log('Creating audit with data:', {
        ...auditData,
        user_id: session.user.id,
        status: "In Progress",
      })

      const result = await createAudit({
        ...auditData,
        user_id: session.user.id,
        status: "In Progress",
      })

      console.log('Audit created:', result)

      toast({
        title: "Success",
        description: "Your new AI ethics audit has been created successfully.",
      })
      
      router.push("/audits")
      router.refresh()
    } catch (error) {
      console.error('Error creating audit:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast({
        title: "Error",
        description: `Failed to create audit: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Start New AI Ethics Audit</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Audit Name</Label>
          <Input
            id="name"
            name="name"
            value={auditData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter the name of your AI system or project"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            name="organization"
            value={auditData.organization}
            onChange={handleInputChange}
            required
            placeholder="Enter your organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={auditData.description}
            onChange={handleInputChange}
            required
            placeholder="Provide a brief description of the AI system being audited"
            className="h-32"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Audit"}
        </Button>
      </form>
    </div>
  )
}

