"use client"

import type { User } from 'firebase/auth'
import { SESSION_MARKER_COOKIE } from '@/lib/firebase/session-config'

/**
 * Cambia el ID token del SDK de cliente por la cookie de sesión del servidor.
 * Sin esto los Server Components no verían al usuario, porque Firebase guarda
 * su sesión en IndexedDB y nunca la envía en las peticiones.
 */
export async function createServerSession(user: User, fullName?: string) {
  const idToken = await user.getIdToken()

  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, fullName }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error ?? 'No se pudo iniciar la sesión')
  }
}

export async function destroyServerSession() {
  await fetch('/api/auth/session', { method: 'DELETE' })
}

/** La cookie de sesión es httpOnly; este marcador replica su vigencia para JS. */
export function hasServerSession(): boolean {
  return document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith(`${SESSION_MARKER_COOKIE}=`))
}

const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/user-not-found': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  'auth/wrong-password': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo electrónico.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.',
  'auth/network-request-failed': 'Error de conexión. Revisa tu acceso a internet.',
}

export function authErrorCode(error: unknown): string | undefined {
  return (error as { code?: string } | null)?.code
}

/** Traduce los códigos de Firebase Auth, que llegan siempre en inglés. */
export function authErrorMessage(error: unknown, fallback: string): string {
  const code = authErrorCode(error)
  return (code && AUTH_ERRORS[code]) || fallback
}
