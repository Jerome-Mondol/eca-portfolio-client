import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

type ListSkeletonProps = {
  count?: number;
  height?: string;
  className?: string;
};

/** Placeholder grid shown while a resource has nothing cached to render. */
export function ListSkeleton({ count = 3, height = "h-32", className = "grid gap-4" }: ListSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={height} />
      ))}
    </div>
  );
}

type ListOrEmptyProps<T> = {
  items: T[];
  gridClassName?: string;
  empty: { title: string; description: string; actionLabel: string; onAction: () => void };
  children: (item: T) => React.ReactNode;
};

/**
 * Empty state or grid of items — the branch every dashboard list repeats.
 *
 * The item count decides nothing about layout, so the grid classes are passed
 * in rather than guessed, keeping each page's existing breakpoints intact.
 */
export function ListOrEmpty<T>({ items, gridClassName, empty, children }: ListOrEmptyProps<T>) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={empty.title}
        description={empty.description}
        actionLabel={empty.actionLabel}
        onAction={empty.onAction}
      />
    );
  }
  return <div className={gridClassName}>{items.map(children)}</div>;
}
