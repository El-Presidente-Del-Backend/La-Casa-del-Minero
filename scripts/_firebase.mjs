import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Carga .env.local sin dependencias externas: los scripts corren con node a secas. */
function loadEnv() {
  let contents
  try {
    contents = readFileSync(join(projectRoot, '.env.local'), 'utf8')
  } catch {
    return
  }

  for (const line of contents.split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    process.env[key] = rawValue.replace(/^["']|["']$/g, '')
  }
}

loadEnv()

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
if (!projectId) {
  console.error('Falta NEXT_PUBLIC_FIREBASE_PROJECT_ID en .env.local')
  process.exit(1)
}

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

const app = initializeApp({
  credential: serviceAccount ? cert(JSON.parse(serviceAccount)) : applicationDefault(),
  projectId,
})

export const db = getFirestore(app)
export const auth = getAuth(app)
export const PROJECT_ID = projectId
