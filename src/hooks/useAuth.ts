import { useEffect, useState } from 'react'
import { blink } from '../blink/client'
import { BlinkUser } from '@blinkdotnew/sdk'

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.displayName === 'Artemiko132' || user?.email === import.meta.env.VITE_ADMIN_EMAIL,
    signIn: (email: string, pass: string) => blink.auth.signInWithEmail(email, pass),
    logout: () => blink.auth.signOut()
  }
}
