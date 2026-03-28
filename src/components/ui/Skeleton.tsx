import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-xl bg-surface-2',
                className
            )}
        />
    );
}

export function PropertyCardSkeleton() {
    return (
        <div className="rounded-2xl bg-surface border border-border overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-3">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}
