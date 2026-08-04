import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import {
  SESSION_COOKIE,
  SESSION_MARKER_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/firebase/session-config'

/**
 * Cambia el ID token del SDK de cliente por una cookie de sesión httpOnly, que
 * es lo único que los Server Components pueden leer. Además crea el documento
 * del usuario en su primer inicio de sesión: reemplaza al trigger
 * `handle_new_user` que existía en Postgres.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const idToken = body?.idToken

  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'Falta el token de acceso' }, { status: 400 })
  }

  let decoded
  try {
    decoded = await adminAuth.verifyIdToken(idToken, true)
  } catch {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  })

  await upsertUser(decoded.uid, decoded.email ?? null, body?.fullName ?? decoded.name ?? '')

  const response = NextResponse.json({ ok: true })
  const options = {
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }

  response.cookies.set(SESSION_COOKIE, sessionCookie, { ...options, httpOnly: true })
  response.cookies.set(SESSION_MARKER_COOKIE, '1', { ...options, httpOnly: false })

  return response
}

/** Cierra la sesión del lado del servidor borrando ambas cookies. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(SESSION_COOKIE)
  response.cookies.delete(SESSION_MARKER_COOKIE)
  return response
}

async function upsertUser(uid: string, email: string | null, fullName: string) {
  const ref = adminDb.collection('users').doc(uid)
  const snap = await ref.get()

  if (!snap.exists) {
    await ref.set({
      email,
      fullName,
      phone: null,
      role: 'customer',
      createdAt: FieldValue.serverTimestamp(),
    })
    return
  }

  // Nunca se toca `role` desde aquí: se administra por script o desde el panel.
  const updates: Record<string, unknown> = { email }
  if (fullName) updates.fullName = fullName
  await ref.update(updates)
}
