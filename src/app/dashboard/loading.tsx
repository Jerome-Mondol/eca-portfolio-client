import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-4">
        <Skeleton className="h-48" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
