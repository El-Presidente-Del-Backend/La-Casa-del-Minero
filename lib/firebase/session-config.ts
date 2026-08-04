// Constantes compartidas entre servidor y cliente. Sin imports: este módulo lo
// consumen tanto las rutas de API como los componentes de cliente.

/** Cookie httpOnly con la sesión firmada. Solo la lee el servidor. */
export const SESSION_COOKIE = 'session'

/**
 * Marcador legible desde JS con la misma expiración que la cookie de sesión.
 * Permite al cliente saber si el servidor ya tiene sesión sin poder leer la
 * cookie httpOnly, y así evitar recrearla en cada carga de página.
 */
export const SESSION_MARKER_COOKIE = 'session_active'

/** 14 días, el máximo que admite createSessionCookie. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14
