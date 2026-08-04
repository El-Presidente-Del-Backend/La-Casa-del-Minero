import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { adminBucket } from "@/lib/firebase/admin"
import { requireAdmin } from "@/lib/firebase/session"

// El destino llega desde el navegador, así que se valida contra una lista fija
// en lugar de confiar en el valor recibido.
const FOLDERS = ["products", "categories"]
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
  } catch (error) {
    const message = error instanceof Error ? error.message : "No autorizado"
    const status = message === "No autenticado" ? 401 : 403
    return NextResponse.json({ error: message }, { status })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "La petición está malformada" }, { status: 400 })
  }

  const file = formData.get("file")
  const folder = formData.get("folder")

  if (!(file instanceof File) || typeof folder !== "string") {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
  }

  if (!FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Destino no permitido" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "El archivo debe ser una imagen JPG, PNG, WebP, AVIF o GIF" },
      { status: 400 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen no puede superar los 5 MB" }, { status: 400 })
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
  const path = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`

  // El token de descarga hace la imagen accesible por URL pública sin depender
  // de permisos por objeto, que el bucket rechaza al usar acceso uniforme.
  const downloadToken = randomUUID()
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await adminBucket.file(path).save(buffer, {
      contentType: file.type,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    })
  } catch (error) {
    console.error("upload error:", error)
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 })
  }

  const url = `https://firebasestorage.googleapis.com/v0/b/${adminBucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`

  return NextResponse.json({ url })
}
