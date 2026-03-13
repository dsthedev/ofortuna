import { Skeleton } from "@/components/ui/skeleton"

export function FortuneSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Skeleton className="h-32 w-full max-w-2xl" />
      <Skeleton className="h-12 w-32" />
    </div>
  )
}
