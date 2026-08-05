/**
 * Siembra las colecciones `categories` y `products` de Firestore.
 * Equivale al antiguo scripts/seed.sql.
 *
 *   node scripts/seed-firestore.mjs           # falla si ya hay datos
 *   node scripts/seed-firestore.mjs --reset   # borra y vuelve a sembrar
 */
import { FieldValue } from 'firebase-admin/firestore'
import { db, PROJECT_ID } from './_firebase.mjs'

const CATEGORIES = [
  { name: 'Seguridad', slug: 'seguridad', label: 'Seguridad', imageUrl: '/images/categories/seguridad.jpg', parent: null },
  { name: 'Herramientas', slug: 'herramientas', label: 'Herramientas', imageUrl: '/images/categories/herramientas.jpg', parent: null },
  { name: 'Iluminacion', slug: 'iluminacion', label: 'Iluminación', imageUrl: '/images/categories/iluminacion.jpg', parent: null },
  { name: 'Deteccion', slug: 'deteccion', label: 'Detección', imageUrl: '/images/categories/deteccion.jpg', parent: null },
  // Subcategorías de ejemplo, para probar la jerarquía de 2 niveles en local.
  { name: 'Cascos', slug: 'cascos', label: 'Cascos', imageUrl: null, parent: 'Seguridad' },
  { name: 'Guantes', slug: 'guantes', label: 'Guantes', imageUrl: null, parent: 'Seguridad' },
]

const PRODUCTS = [
  {
    name: 'Casco de Seguridad Industrial',
    description: 'Casco de protección clase E con suspensión de 4 puntos. Resistente a impactos y dieléctrico.',
    longDescription:
      'Casco de seguridad industrial diseñado para las condiciones más exigentes de la minería. Fabricado con polietileno de alta densidad, cuenta con suspensión ajustable de 4 puntos para máxima comodidad durante jornadas largas. Certificado bajo norma ANSI/ISEA Z89.1 Clase E, ofrece protección contra impactos laterales y superiores, así como aislamiento dieléctrico hasta 20,000V. Compatible con accesorios como protectores faciales, orejeras y lámparas frontales.',
    price: 45.0,
    originalPrice: null,
    category: 'Cascos',
    imageUrl: '/images/products/casco-seguridad.jpg',
    badge: 'Más vendido',
    inStock: true,
    sku: 'SEG-CAS-001',
    specs: [
      { label: 'Material', value: 'Polietileno de alta densidad' },
      { label: 'Norma', value: 'ANSI/ISEA Z89.1 Clase E' },
      { label: 'Suspensión', value: '4 puntos ajustable' },
      { label: 'Peso', value: '380g' },
      { label: 'Color', value: 'Amarillo' },
    ],
  },
  {
    name: 'Broca de Perforación TC',
    description: 'Broca de carburo de tungsteno para perforación en roca dura. Alta durabilidad.',
    longDescription:
      'Broca de perforación fabricada con insertos de carburo de tungsteno de grado premium, diseñada específicamente para perforación en roca dura y semi-dura. Su geometría de corte optimizada maximiza la tasa de penetración mientras minimiza el desgaste. Ideal para operaciones de voladura, exploración y extracción. Disponible en diferentes diámetros para adaptarse a diversos equipos de perforación.',
    price: 320.0,
    originalPrice: 380.0,
    category: 'Herramientas',
    imageUrl: '/images/products/broca-perforacion.jpg',
    badge: 'Oferta',
    inStock: true,
    sku: 'HER-BRO-002',
    specs: [
      { label: 'Material', value: 'Carburo de tungsteno' },
      { label: 'Diámetro', value: '76mm' },
      { label: 'Rosca', value: 'R32' },
      { label: 'Peso', value: '4.2kg' },
      { label: 'Uso', value: 'Roca dura y semi-dura' },
    ],
  },
  {
    name: 'Botas de Seguridad Minera',
    description: 'Botas con punta de acero, suela antideslizante y resistente a químicos.',
    longDescription:
      'Botas de seguridad diseñadas para el sector minero con punta de acero que soporta impactos de hasta 200J. La suela de poliuretano bidensidad ofrece resistencia excepcional a la abrasión, aceites y químicos, además de propiedades antideslizantes en superficies mojadas. El forro interior transpirable mantiene el pie seco durante toda la jornada. Cumple normativa EN ISO 20345:2011 S3.',
    price: 120.0,
    originalPrice: null,
    category: 'Seguridad',
    imageUrl: '/images/products/botas-seguridad.jpg',
    badge: 'Nuevo',
    inStock: true,
    sku: 'SEG-BOT-003',
    specs: [
      { label: 'Punta', value: 'Acero (200J)' },
      { label: 'Suela', value: 'PU bidensidad antideslizante' },
      { label: 'Norma', value: 'EN ISO 20345:2011 S3' },
      { label: 'Tallas', value: '38 - 46' },
      { label: 'Material', value: 'Cuero flor hidrofugado' },
    ],
  },
  {
    name: 'Lámpara Minera LED',
    description: 'Lámpara frontal LED con batería recargable de larga duración. 10,000 lúmenes.',
    longDescription:
      'Lámpara minera de última generación con tecnología LED de alto rendimiento que proporciona hasta 10,000 lúmenes de iluminación. Su batería de litio recargable ofrece hasta 16 horas de autonomía en modo estándar. Certificación IP68 para resistencia total al polvo y sumersión. Diseño ligero con clip para casco y banda elástica ajustable. Incluye cargador rápido y cable USB-C.',
    price: 85.0,
    originalPrice: null,
    category: 'Iluminacion',
    imageUrl: '/images/products/lampara-minera.jpg',
    badge: null,
    inStock: true,
    sku: 'ILU-LAM-004',
    specs: [
      { label: 'Luminosidad', value: '10,000 lúmenes' },
      { label: 'Batería', value: 'Li-ion 6800mAh' },
      { label: 'Autonomía', value: 'Hasta 16 horas' },
      { label: 'Protección', value: 'IP68' },
      { label: 'Carga', value: 'USB-C carga rápida' },
    ],
  },
  {
    name: 'Guantes de Trabajo Reforzados',
    description: 'Guantes con refuerzo en palma y dedos. Resistentes a abrasión y cortes.',
    longDescription:
      'Guantes de trabajo profesionales diseñados para entornos mineros con refuerzo de doble capa en palma y dedos. Ofrecen resistencia nivel 5 contra cortes y nivel 4 contra abrasión según norma EN 388. El dorso transpirable permite ventilación mientras el cierre de velcro garantiza un ajuste seguro. Ideales para manejo de herramientas, cables y materiales abrasivos.',
    price: 28.0,
    originalPrice: null,
    category: 'Seguridad',
    imageUrl: '/images/products/guantes-trabajo.jpg',
    badge: null,
    inStock: true,
    sku: 'SEG-GUA-005',
    specs: [
      { label: 'Material', value: 'Nylon/Nitrilo reforzado' },
      { label: 'Norma', value: 'EN 388:2016' },
      { label: 'Corte', value: 'Nivel 5' },
      { label: 'Tallas', value: 'S, M, L, XL' },
      { label: 'Cierre', value: 'Velcro ajustable' },
    ],
  },
  {
    name: 'Detector de Gas Portátil',
    description: 'Detector multigas con pantalla LCD. Detecta CH4, CO, O2 y H2S.',
    longDescription:
      'Detector de gas portátil de 4 canales diseñado para ambientes mineros subterráneos. Detecta simultáneamente metano (CH4), monóxido de carbono (CO), oxígeno (O2) y sulfuro de hidrógeno (H2S). Pantalla LCD retroiluminada de alta visibilidad con indicadores gráficos en tiempo real. Alarmas sonoras (95dB), visuales (LED) y vibratorias. Certificación ATEX zona 0 para uso en atmósferas explosivas. Batería recargable con hasta 18 horas de uso continuo.',
    price: 580.0,
    originalPrice: null,
    category: 'Deteccion',
    imageUrl: '/images/products/detector-gas.jpg',
    badge: 'Premium',
    inStock: true,
    sku: 'DET-GAS-006',
    specs: [
      { label: 'Gases', value: 'CH4, CO, O2, H2S' },
      { label: 'Certificación', value: 'ATEX Zona 0' },
      { label: 'Alarmas', value: 'Sonora, visual, vibratoria' },
      { label: 'Autonomía', value: '18 horas' },
      { label: 'Pantalla', value: 'LCD retroiluminada' },
    ],
  },
  {
    name: 'Pico Minero Profesional',
    description: 'Pico de acero forjado con mango de madera de hickory. Peso equilibrado.',
    longDescription:
      'Pico minero profesional fabricado en acero al carbono forjado y templado para máxima durabilidad. El mango de madera de hickory americano ofrece absorción de impactos y comodidad de agarre. Su peso equilibrado de 2.5kg permite uso prolongado sin fatiga excesiva. Cabeza de doble punta con filo de cincel en un extremo y punta en el otro para versatilidad en diferentes tipos de roca.',
    price: 65.0,
    originalPrice: null,
    category: 'Herramientas',
    imageUrl: '/images/products/pico-minero.jpg',
    badge: null,
    inStock: false,
    sku: 'HER-PIC-007',
    specs: [
      { label: 'Material cabeza', value: 'Acero al carbono forjado' },
      { label: 'Mango', value: 'Madera de hickory' },
      { label: 'Peso total', value: '2.5kg' },
      { label: 'Largo mango', value: '90cm' },
      { label: 'Tipo', value: 'Doble punta' },
    ],
  },
  {
    name: 'Chaleco Reflectante Alta Visibilidad',
    description: 'Chaleco con bandas reflectantes 3M. Cumple normativa EN 20471 clase 2.',
    longDescription:
      'Chaleco de alta visibilidad fabricado con tejido fluorescente de poliéster transpirable. Incorpora bandas reflectantes 3M Scotchlite de 50mm que garantizan visibilidad a 360 grados en condiciones de poca luz. Cumple estrictamente la normativa EN ISO 20471:2013 Clase 2. Cierre de velcro frontal para fácil colocación y ajuste. Múltiples bolsillos para herramientas y documentación.',
    price: 22.0,
    originalPrice: null,
    category: 'Seguridad',
    imageUrl: '/images/products/chaleco-reflectante.jpg',
    badge: null,
    inStock: true,
    sku: 'SEG-CHA-008',
    specs: [
      { label: 'Material', value: 'Poliéster fluorescente' },
      { label: 'Bandas', value: '3M Scotchlite 50mm' },
      { label: 'Norma', value: 'EN ISO 20471 Clase 2' },
      { label: 'Tallas', value: 'M, L, XL, XXL' },
      { label: 'Cierre', value: 'Velcro frontal' },
    ],
  },
]

async function deleteCollection(name) {
  const snapshot = await db.collection(name).get()
  if (snapshot.empty) return 0

  const batch = db.batch()
  snapshot.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
  return snapshot.size
}

async function main() {
  const reset = process.argv.includes('--reset')
  console.log(`Proyecto: ${PROJECT_ID}`)

  const existing = await db.collection('products').limit(1).get()
  if (!existing.empty && !reset) {
    console.error('Ya hay productos en Firestore. Usa --reset para borrarlos y volver a sembrar.')
    process.exit(1)
  }

  if (reset) {
    const removed = (await deleteCollection('products')) + (await deleteCollection('categories'))
    console.log(`Borrados ${removed} documentos previos.`)
  }

  // Las categorías van primero: sus IDs son necesarios para cada producto.
  // Dos pasadas porque las subcategorías necesitan el id ya asignado de su
  // padre (jerarquía de 2 niveles: los padres siempre se crean primero).
  const categoryIds = new Map()
  const topLevel = CATEGORIES.filter((c) => c.parent === null)
  const subLevel = CATEGORIES.filter((c) => c.parent !== null)

  for (const { parent, ...category } of topLevel) {
    const ref = await db.collection('categories').add({
      ...category,
      parentId: null,
      createdAt: FieldValue.serverTimestamp(),
    })
    categoryIds.set(category.name, ref.id)
  }
  for (const { parent, ...category } of subLevel) {
    const ref = await db.collection('categories').add({
      ...category,
      parentId: categoryIds.get(parent),
      createdAt: FieldValue.serverTimestamp(),
    })
    categoryIds.set(category.name, ref.id)
  }
  console.log(`${CATEGORIES.length} categorías creadas.`)

  const parentNameByCategory = new Map(CATEGORIES.map((c) => [c.name, c.parent]))

  for (const { category, ...product } of PRODUCTS) {
    const parentName = parentNameByCategory.get(category)
    await db.collection('products').add({
      ...product,
      categoryId: categoryIds.get(category),
      categoryName: category,
      parentCategoryId: parentName ? categoryIds.get(parentName) : null,
      parentCategoryName: parentName ?? '',
      createdAt: FieldValue.serverTimestamp(),
    })
  }
  console.log(`${PRODUCTS.length} productos creados.`)

  console.log('Listo.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
