"use client"

import { useEffect, useState } from 'react'
import { onIdTokenChanged, type User } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase/client'
import { createServerSession, hasServerSession } from '@/lib/firebase/auth-client'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(getFirebaseAuth(), async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      // El SDK de cliente mantiene su propia sesión, que puede sobrevivir a la
      // cookie del servidor. Si eso pasa, se vuelve a emitir para que las
      // páginas renderizadas en servidor sigan reconociendo al usuario.
      if (firebaseUser && !hasServerSession()) {
        await createServerSession(firebaseUser).catch(() => {})
      }
    })

    return unsubscribe
  }, [])

  return { user, loading }
}
