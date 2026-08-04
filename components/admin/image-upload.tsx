"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  label: string
  name?: string
  defaultValue?: string
  folder: "products" | "categories"
}

export function ImageUpload({ label, name = "image_url", defaultValue, folder }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue ?? "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync when defaultValue changes (e.g. switching between category edits)
  useEffect(() => {
    setUrl(defaultValue ?? "")
  }, [defaultValue])

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? "Error al subir la imagen")
      setUploading(false)
      return
    }

    setUrl(data.url)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      {/* Valor real enviado al form */}
      <input type="hidden" name={name} value={url} />

      {/* Vista previa */}
      {url && (
        <div className="relative h-28 w-28 overflow-hidden rounded-md border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Vista previa" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 hover:bg-background"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Botón subir */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="gap-1.5 text-xs"
        >
          <Upload className="h-3 w-3" />
          {uploading ? "Subiendo..." : url ? "Cambiar imagen" : "Subir imagen"}
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = "" // permite re-seleccionar el mismo archivo
        }}
      />

      {/* Input de URL manual como alternativa */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="/images/... o URL pública"
        className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  )
}
