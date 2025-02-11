"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createNewAudit } from "../actions"

export default function NewAudit() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Audit</CardTitle>
          <CardDescription>
            Start a new AI ethics audit by providing basic information about the system to be audited.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createNewAudit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Audit Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Customer Service AI Chatbot Ethics Audit"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="organization" className="text-sm font-medium">
                Organization
              </label>
              <Input
                id="organization"
                name="organization"
                placeholder="Your organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the AI system to be audited"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => history.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Audit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

