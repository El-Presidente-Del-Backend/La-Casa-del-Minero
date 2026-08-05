import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'

// SDK de cliente. Se usa exclusivamente para autenticación: todas las lecturas y
// escrituras de datos pasan por el servidor con el Admin SDK.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
let emulatorConnected = false

export function getFirebaseApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth {
  const auth = getAuth(getFirebaseApp())

  // Apagado por defecto: solo se activa con NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
  // en .env.local, variable que no existe en apphosting.yaml — en producción
  // esta rama nunca se ejecuta.
  if (USE_EMULATOR && !emulatorConnected) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    emulatorConnected = true
  }

  return auth
}
