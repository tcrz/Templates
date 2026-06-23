import { Skeleton } from "@/components/ui/skeleton"
import { StatCardsGrid } from "../ui/stat-card"

interface StatCardSkeletonProps {
  /** Number of placeholder cards (default 4). */
  count?: number
}

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
    return (
        <StatCardsGrid>
            {[...Array(count)].map((_, index) => (
                <div className="p-4 border rounded-sm bg-white" key={index}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-7 w-16" />
                        </div>
                        <Skeleton className="size-8 rounded-lg" />
                    </div>
                </div>))}
        </StatCardsGrid>

    )
}
