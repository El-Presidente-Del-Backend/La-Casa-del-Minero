"use client"

import { useState } from "react"
import { Menu, Pickaxe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminNav } from "./admin-nav"

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 gap-0 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-foreground">
            <Pickaxe className="h-5 w-5 text-primary" />
            Admin
          </SheetTitle>
        </SheetHeader>
        <AdminNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
