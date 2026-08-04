"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { MAX_PRODUCT_IMAGES } from "@/lib/validations/product"

interface MultiImageUploadProps {
  label: string
  name?: string
  defaultValue?: string[]
  folder: "products"
}

export function MultiImageUpload({
  label,
  name = "image_urls",
  defaultValue,
  folder,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultValue ?? [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualUrl, setManualUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = MAX_PRODUCT_IMAGES - images.length
  const atLimit = remaining <= 0

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error ?? "Error al subir la imagen")
    return data.url as string
  }

  const handleFiles = async (files: FileList) => {
    const toUpload = Array.from(files).slice(0, remaining)
    if (toUpload.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const urls = await Promise.all(toUpload.map(uploadFile))
      setImages((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  const removeAt = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i))

  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    setImages((prev) => {
      const next = [...prev]
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }

  const addManualUrl = () => {
    const url = manualUrl.trim()
    if (!url || atLimit) return
    setImages((prev) => [...prev, url])
    setManualUrl("")
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      {/* Valor real enviado al form: un hidden por imagen, mismo patrón que las specs */}
      {images.map((url, i) => (
        <input key={i} type="hidden" name={name} value={url} />
      ))}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative h-24 w-24 overflow-hidden rounded-md border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <Badge variant="secondary" className="absolute left-1 top-1 px-1 text-[9px]">
                  Portada
                </Badge>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 hover:bg-background"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 right-1 flex gap-0.5">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => moveTo(i, i - 1)}
                  className="rounded-full bg-background/80 p-0.5 hover:bg-background disabled:opacity-30"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  disabled={i === images.length - 1}
                  onClick={() => moveTo(i, i + 1)}
                  className="rounded-full bg-background/80 p-0.5 hover:bg-background disabled:opacity-30"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || atLimit}
          onClick={() => inputRef.current?.click()}
          className="gap-1.5 text-xs"
        >
          <Upload className="h-3 w-3" />
          {uploading ? "Subiendo..." : "Agregar imágenes"}
        </Button>
        <span className="text-xs text-muted-foreground">
          {images.length}/{MAX_PRODUCT_IMAGES}
        </span>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {/* URL manual como alternativa */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="/images/... o URL pública"
          disabled={atLimit}
          className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={atLimit || !manualUrl.trim()}
          onClick={addManualUrl}
        >
          Agregar URL
        </Button>
      </div>
    </div>
  )
}
