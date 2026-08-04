/**
 * Crea (o promueve) la cuenta de administrador.
 * Reemplaza al rol 'admin' de la tabla profiles y a las políticas RLS de admin.
 *
 *   node scripts/set-admin.mjs correo@ejemplo.com [contraseña]
 *
 * Si la cuenta ya existe solo se le asigna el rol. Si no existe se crea: con la
 * contraseña indicada, o sin contraseña si se omite, en cuyo caso el script
 * imprime un enlace para que el propio administrador la establezca.
 *
 * El custom claim `admin` es lo que leen las reglas y la verificación de sesión;
 * el campo `role` del documento es la fuente de verdad.
 */
import { FieldValue } from 'firebase-admin/firestore'
import { auth, db, PROJECT_ID } from './_firebase.mjs'

async function main() {
  const [email, password] = process.argv.slice(2)

  if (!email) {
    console.error('Uso: node scripts/set-admin.mjs correo@ejemplo.com [contraseña]')
    process.exit(1)
  }

  console.log(`Proyecto: ${PROJECT_ID}`)

  let user
  let needsPassword = false

  try {
    user = await auth.getUserByEmail(email)
    console.log(`Cuenta existente: ${user.uid}`)
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error

    if (password && password.length < 6) {
      console.error('La contraseña debe tener al menos 6 caracteres.')
      process.exit(1)
    }

    user = await auth.createUser({
      email,
      emailVerified: true,
      ...(password ? { password } : {}),
    })
    needsPassword = !password
    console.log(`Cuenta creada: ${user.uid}`)
  }

  await auth.setCustomUserClaims(user.uid, { admin: true })

  await db.collection('users').doc(user.uid).set(
    {
      email,
      role: 'admin',
      fullName: user.displayName ?? 'Administrador',
      phone: null,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  )

  console.log(`${email} ya es administrador.`)

  if (needsPassword) {
    const link = await auth.generatePasswordResetLink(email)

    // El Admin SDK deja `apiKey` vacío en el enlace; sin ella la página de
    // Firebase no puede canjear el código.
    const url = new URL(link)
    if (!url.searchParams.get('apiKey')) {
      url.searchParams.set('apiKey', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '')
    }

    console.log('\nLa cuenta se creó sin contraseña. Establécela con este enlace:')
    console.log(url.toString())
    console.log('\nTambién puedes pedir el correo desde /auth/recuperar en la web.')
  }

  console.log('\nSi tenía la sesión abierta, debe cerrarla y volver a entrar para que se aplique.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
