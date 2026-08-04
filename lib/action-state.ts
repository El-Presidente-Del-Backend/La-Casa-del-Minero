// Contrato compartido de las Server Actions del admin. No lleva "use server":
// se importa tanto desde acciones de servidor como desde componentes cliente
// que necesitan tipar el estado de useActionState.

export type FieldErrors = Record<string, string[] | undefined>

export type ActionState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: FieldErrors
  /** Ruta a la que el cliente debe navegar tras un éxito (la acción ya revalidó). */
  redirectTo?: string
}

export const idleState: ActionState = { status: "idle" }

export function okState(message: string, redirectTo?: string): ActionState {
  return { status: "success", message, redirectTo }
}

export function failState(message: string, fieldErrors?: FieldErrors): ActionState {
  return { status: "error", message, fieldErrors }
}
