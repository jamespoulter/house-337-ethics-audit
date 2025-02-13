"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'

export function NavigationMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setMounted(true)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
      setMounted(false)
    }
  }, [])

  // Don't render anything until after mounting to prevent hydration errors
  if (!mounted) return null

  // Don't show navigation items if user is not logged in
  if (!user) return null

  return (
    <>
      <Link href="/dashboard" className="text-white hover:text-[#FF0055] transition-colors">
        Dashboard
      </Link>
      <Link href="/audits" className="text-white hover:text-[#FF0055] transition-colors">
        Audits
      </Link>
      <Link href="/settings" className="text-white hover:text-[#FF0055] transition-colors">
        Settings
      </Link>
    </>
  )
} 