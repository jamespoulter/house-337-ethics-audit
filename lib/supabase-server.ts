import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

// Create a server-side Supabase client (this is safe to expose)
export const getServerSupabase = () => {
  return createServerComponentClient<Database>({
    cookies
  })
}

// Server-side functions that need cookies/session
export async function getServerSession() {
  const supabase = getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getServerUser() {
  const session = await getServerSession()
  return session?.user ?? null
} 