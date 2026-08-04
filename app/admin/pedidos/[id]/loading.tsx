import { Skeleton } from "@/components/ui/skeleton"

export default function PedidoDetalleLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="mb-4 h-5 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}
