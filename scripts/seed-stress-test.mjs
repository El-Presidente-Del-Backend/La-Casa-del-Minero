/**
 * Siembra una cantidad grande de categorías y productos ficticios para probar
 * visualmente la interfaz con volumen (paginación, gráficos, alertas...).
 *
 * SOLO corre contra el emulador de Firestore/Auth — nunca contra el proyecto
 * real. Requiere que FIRESTORE_EMULATOR_HOST esté seteado (ver .env.local).
 *
 *   firebase emulators:start --only auth,firestore
 *   node scripts/seed-stress-test.mjs
 */
import { FieldValue } from 'firebase-admin/firestore'
import { db, auth, PROJECT_ID } from './_firebase.mjs'

// Guardia de seguridad: este script escribe cientos de documentos falsos,
// así que se niega a correr si no detecta el emulador — no debe poder
// ejecutarse por error contra Firestore real.
if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error(
    'FIRESTORE_EMULATOR_HOST no está seteado. Este script SOLO debe correr contra el emulador de Firestore.\n' +
      'Corre primero: firebase emulators:start --only auth,firestore\n' +
      'y asegúrate de que .env.local tenga FIRESTORE_EMULATOR_HOST=localhost:8080'
  )
  process.exit(1)
}

const CATEGORY_COUNT = 25
const PRODUCT_COUNT = 400
const PLACEHOLDER_IMAGE = '/images/products/placeholder.jpg'

const ADMIN_TEST_EMAIL = 'admin@test.local'
const ADMIN_TEST_PASSWORD = 'test123456'

// Rango Unicode de diacríticos combinantes (U+0300–U+036F), construido desde
// los puntos de código para evitar caracteres combinantes literales en el
// código fuente.
const COMBINING_DIACRITICS = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  'g'
)

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function chance(probability) {
  return Math.random() < probability
}

function randomPastDate(monthsBack = 12) {
  const now = Date.now()
  const past = now - randomInt(0, monthsBack * 30) * 24 * 60 * 60 * 1000
  return new Date(past)
}

// ---------------------------------------------------------------------------
// Generación de categorías
// ---------------------------------------------------------------------------

const CATEGORY_TOPICS = [
  'Seguridad',
  'Herramientas',
  'Iluminacion',
  'Deteccion',
  'Perforacion',
  'Ventilacion',
  'Transporte',
  'Maquinaria Pesada',
  'Repuestos',
  'Lubricantes',
  'Explosivos y Voladura',
  'Topografia',
  'Comunicaciones',
  'Rescate y Emergencia',
  'Hidraulica',
  'Neumatica',
  'Soldadura',
  'Electricidad',
  'Filtracion',
  'Bombeo',
  'Senalizacion',
  'Almacenamiento',
  'Limpieza Industrial',
  'Instrumentacion',
  'Proteccion Respiratoria',
  'Equipos de Izaje',
  'Calzado de Seguridad',
]

function buildCategories() {
  const topics = CATEGORY_TOPICS.slice(0, CATEGORY_COUNT)
  return topics.map((topic) => ({
    name: topic,
    slug: slugify(topic),
    label: topic,
    imageUrl: null,
  }))
}

// ---------------------------------------------------------------------------
// Generación de productos
// ---------------------------------------------------------------------------

const NOUNS = [
  'Casco', 'Chaleco', 'Guante', 'Bota', 'Lampara', 'Detector', 'Careta', 'Arnes',
  'Cuerda', 'Extintor', 'Radio', 'Taladro', 'Martillo', 'Llave', 'Cable', 'Manguera',
  'Valvula', 'Bomba', 'Filtro', 'Sensor', 'Cinta', 'Senal', 'Extractor', 'Ventilador',
  'Generador', 'Bateria', 'Cargador', 'Overol', 'Protector', 'Respirador', 'Andamio',
  'Grua', 'Compresor', 'Soldadora', 'Winche', 'Tubo', 'Conector', 'Interruptor',
]

const ADJECTIVES = [
  'Industrial', 'Minero', 'Profesional', 'Reforzado', 'Portatil', 'De Alta Resistencia',
  'Certificado', 'Premium', 'Estandar', 'Compacto', 'De Emergencia', 'Multifuncion',
  'Resistente al Agua', 'Antideslizante', 'Ultraligero', 'Heavy Duty', 'Modular',
]

const BADGES = ['Nuevo', 'Oferta', 'Premium', 'Mas vendido']

function buildSpecs() {
  const count = randomInt(2, 5)
  return Array.from({ length: count }, (_, i) => ({
    label: `Especificacion ${i + 1}`,
    value: pick(['Estandar', 'Reforzado', 'Alta gama', `${randomInt(1, 100)} unidades`, 'Certificado ISO']),
  }))
}

function buildProducts(categories) {
  const products = []

  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const noun = pick(NOUNS)
    const adjective = pick(ADJECTIVES)
    const price = randomInt(5, 1500)
    const hasDiscount = chance(0.2)
    const missingCategory = chance(0.05)
    const missingSpecs = chance(0.1)
    const missingCreatedAt = chance(0.03)
    const useLegacyImage = chance(0.5)
    const category = missingCategory ? null : pick(categories)

    const product = {
      name: `${noun} ${adjective}`,
      description: `${noun} ${adjective.toLowerCase()} para uso en faenas mineras.`,
      longDescription: `${noun} ${adjective.toLowerCase()} pensado para condiciones exigentes de la mineria. Fabricado con materiales de alta calidad y sometido a control de calidad estricto antes de despacho.`,
      price,
      originalPrice: hasDiscount ? Math.round(price * 1.25) : null,
      categoryId: category ? category.id : null,
      categoryName: category ? category.name : '',
      badge: chance(0.15) ? pick(BADGES) : null,
      inStock: chance(0.85),
      sku: `STRESS-${String(i).padStart(4, '0')}`,
      specs: missingSpecs ? [] : buildSpecs(),
    }

    if (useLegacyImage) {
      product.imageUrl = PLACEHOLDER_IMAGE
    } else {
      product.images = [PLACEHOLDER_IMAGE]
    }

    if (!missingCreatedAt) {
      product.createdAt = randomPastDate()
    }

    products.push(product)
  }

  return products
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

async function writeInBatches(collection, docs, toData) {
  const CHUNK = 400
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = db.batch()
    docs.slice(i, i + CHUNK).forEach((doc) => {
      const ref = db.collection(collection).doc()
      batch.set(ref, toData(doc))
    })
    await batch.commit()
  }
}

async function seedAdminUser() {
  let user
  try {
    user = await auth.getUserByEmail(ADMIN_TEST_EMAIL)
  } catch {
    user = await auth.createUser({
      email: ADMIN_TEST_EMAIL,
      password: ADMIN_TEST_PASSWORD,
      emailVerified: true,
      displayName: 'Admin de Prueba',
    })
  }

  await auth.setCustomUserClaims(user.uid, { admin: true })
  await db.collection('users').doc(user.uid).set({
    email: ADMIN_TEST_EMAIL,
    fullName: 'Admin de Prueba',
    phone: null,
    role: 'admin',
    createdAt: FieldValue.serverTimestamp(),
  })

  return user
}

async function main() {
  console.log(`Proyecto (emulador): ${PROJECT_ID}`)
  console.log(`Firestore emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`)

  const categoryDefs = buildCategories()
  const categoryRefs = []
  const batch1 = db.batch()
  categoryDefs.forEach((cat) => {
    const ref = db.collection('categories').doc()
    categoryRefs.push({ id: ref.id, ...cat })
    batch1.set(ref, { ...cat, createdAt: FieldValue.serverTimestamp() })
  })
  await batch1.commit()
  console.log(`${categoryRefs.length} categorias creadas.`)

  const products = buildProducts(categoryRefs)
  // Se pasa el objeto tal cual: buildProducts() ya omite la clave createdAt
  // por completo (en vez de ponerla en undefined) para el ~3% de productos
  // "legacy" sin fecha — Firestore rechaza valores undefined explícitos.
  await writeInBatches('products', products, (p) => p)
  console.log(`${products.length} productos creados.`)

  const admin = await seedAdminUser()
  console.log(`Usuario admin de prueba: ${ADMIN_TEST_EMAIL} / ${ADMIN_TEST_PASSWORD} (uid ${admin.uid})`)

  console.log('Listo. Solo existe en el emulador — se pierde al apagarlo.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
