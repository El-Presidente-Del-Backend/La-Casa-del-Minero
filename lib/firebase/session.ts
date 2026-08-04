import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { SESSION_COOKIE } from '@/lib/firebase/session-config'

export type SessionUser = {
  uid: string
  email: string | null
  isAdmin: boolean
}

/**
 * Identidad del visitante según la cookie de sesión, o null si no hay sesión
 * válida. Sustituye al `supabase.auth.getUser()` de los Server Components.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionCookie) return null

  try {
    // checkRevoked: true consulta el estado de la cuenta, así un usuario
    // deshabilitado o con tokens revocados deja de pasar de inmediato.
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

    // El custom claim evita una lectura de Firestore en el caso normal. Cuando
    // falta (rol recién asignado, cookie anterior al cambio) se cae al
    // documento del usuario, que es la fuente de verdad.
    const isAdmin =
      decoded.admin === true || (await readRole(decoded.uid)) === 'admin'

    return { uid: decoded.uid, email: decoded.email ?? null, isAdmin }
  } catch {
    return null
  }
}

async function readRole(uid: string): Promise<string | null> {
  const snap = await adminDb.collection('users').doc(uid).get()
  return (snap.data()?.role as string | undefined) ?? null
}

/** Lanza si quien llama no es administrador. Usado por las Server Actions. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error('No autenticado')
  if (!user.isAdmin) throw new Error('No autorizado')
  return user
}
