import { applicationDefault, cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Servidor únicamente. En App Hosting las credenciales llegan por ADC; en local
// se usa FIREBASE_SERVICE_ACCOUNT_KEY (JSON completo de la cuenta de servicio)
// o, si no está, el ADC de `gcloud auth application-default login`.
function credential() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (raw) return cert(JSON.parse(raw))
  return applicationDefault()
}

function initApp(): App {
  const app = initializeApp({
    credential: credential(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })

  // settings() solo puede llamarse una vez por app, antes del primer uso.
  getFirestore(app).settings({ ignoreUndefinedProperties: true })

  return app
}

const app = getApps().length > 0 ? getApp() : initApp()

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)
export const adminBucket = getStorage(app).bucket()
