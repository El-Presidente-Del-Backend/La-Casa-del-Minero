import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriasLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-none border-b border-border last:border-0" />
        ))}
      </div>
    </div>
  )
}
