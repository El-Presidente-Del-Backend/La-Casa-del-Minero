import { Skeleton } from "@/components/ui/skeleton"

export default function PedidosLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-9 w-80" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="flex w-72 shrink-0 flex-col gap-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex min-h-32 flex-col gap-2 rounded-lg border border-dashed border-border p-2">
              {Array.from({ length: 2 }).map((_, card) => (
                <Skeleton key={card} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
