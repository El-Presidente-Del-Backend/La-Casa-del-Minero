"use client"

import { useEffect, useState } from 'react'
import { onIdTokenChanged, type User } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase/client'
import { createServerSession, hasServerSession } from '@/lib/firebase/auth-client'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(getFirebaseAuth(), async (firebaseUser) => {
      setUser(firebaseUser)

      // El custom claim "admin" viaja en el propio ID token — es el mismo
      // camino rápido que usa getCurrentUser() en el servidor (lib/firebase/session.ts).
      // No se consulta el fallback de Firestore aquí: es solo para mostrar un
      // atajo de conveniencia, no para autorizar nada.
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult().catch(() => null)
        setIsAdmin(tokenResult?.claims.admin === true)
      } else {
        setIsAdmin(false)
      }

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

  return { user, isAdmin, loading }
}
