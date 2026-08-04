"use client"

import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { LogOut, User } from "lucide-react"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { destroyServerSession } from "@/lib/firebase/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function AdminUserMenu({ email }: { email: string | null }) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(getFirebaseAuth())
    await destroyServerSession()
    // replace (no push): que "atrás" no vuelva a un panel sin sesión.
    router.replace("/auth/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate text-xs">{email ?? "Cuenta"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
