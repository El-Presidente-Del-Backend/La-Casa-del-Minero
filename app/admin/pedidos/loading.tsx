import { Skeleton } from "@/components/ui/skeleton"

export default function PedidosLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-9 w-full" />
      <div className="overflow-hidden rounded-lg border border-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-none border-b border-border last:border-0" />
        ))}
      </div>
    </div>
  )
}
