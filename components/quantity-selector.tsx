"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuantitySelector({ disabled = false }: { disabled?: boolean }) {
  const [qty, setQty] = useState(1)

  return (
    <div className="flex items-center rounded-md border border-border">
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-none rounded-l-md"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        disabled={disabled || qty <= 1}
        aria-label="Reducir cantidad"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground">
        {qty}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-none rounded-r-md"
        onClick={() => setQty((q) => Math.min(10, q + 1))}
        disabled={disabled || qty >= 10}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
