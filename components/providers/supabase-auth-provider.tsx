'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session, User } from '@supabase/supabase-js'
import { supabase, upsertProfile } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, fullName: string, organization: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string, organization: string) => {
    try {
      // First check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single()

      if (checkError && !checkError.message.includes('No rows found')) {
        console.error('Error checking existing user:', checkError)
        throw new Error('Error checking user existence. Please try again.')
      }

      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      }

      // Proceed with sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        if (error.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please try signing in instead.')
        }
        throw error
      }

      if (!data.user) {
        throw new Error('No user data returned from signup')
      }

      // Create profile with more detailed error handling
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          organization: organization
        })
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error details:', {
          error: profileError,
          userId: data.user.id,
          email: data.user.email
        })
        throw new Error(`Failed to create user profile: ${profileError.message}`)
      }

      // Sign in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        console.error('Auto sign-in error:', signInError)
        throw signInError
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Complete signup error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password')
        }
        throw error
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error during sign in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error during sign out:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider')
  }
  return context
} 