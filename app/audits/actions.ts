'use server'

import { redirect } from "next/navigation"
import { createAudit } from "@/lib/supabase/client"

export async function createNewAudit(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const organization = formData.get('organization') as string

  if (!title || !organization) {
    throw new Error('Title and organization are required')
  }

  try {
    const audit = await createAudit({
      title,
      description,
      organization,
    })

    redirect(`/audits/${audit.id}`)
  } catch (error) {
    console.error('Error creating audit:', error)
    throw error
  }
} 