"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{
    error: Error | null
    success: boolean
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Flag to determine if we're in development mode - will be true in dev and false in production
const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.NODE_ENV !== 'production'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we should use dev mode authentication
    const shouldUseDevAuth = IS_DEV_MODE && 
                            (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
                             !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (shouldUseDevAuth) {
      console.warn("Supabase not configured. Using development mode authentication.")
      // Auto-authenticate in development mode
      setUser({ email: 'dev@example.com', role: 'admin' } as User)
      setSession({} as Session)
      setIsLoading(false)
      return
    }

    // Check active session
    const getSession = async () => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error fetching session:", error)
        // If in dev mode, still allow access
        if (IS_DEV_MODE) {
          setUser({ email: 'dev@example.com', role: 'admin' } as User)
          setSession({} as Session)
        }
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Error setting up auth state change listener:", error)
      // If in dev mode and error occurs, still allow access
      if (IS_DEV_MODE) {
        setUser({ email: 'dev@example.com', role: 'admin' } as User)
        setSession({} as Session)
        setIsLoading(false)
      }
      return () => {}
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Auto-login for development mode
      if (IS_DEV_MODE && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        setUser({ email: 'dev@example.com', role: 'admin' } as User)
        setSession({} as Session)
        return { error: null, success: true }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return {
        error,
        success: !error,
      }
    } catch (error) {
      console.error("Sign in error:", error)
      
      // If in dev mode and error occurs, still allow access
      if (IS_DEV_MODE) {
        setUser({ email: 'dev@example.com', role: 'admin' } as User)
        setSession({} as Session)
        return { error: null, success: true }
      }
      
      return {
        error: error as Error,
        success: false,
      }
    }
  }

  const signOut = async () => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      // Always clear the local state
      setUser(null)
      setSession(null)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 