import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 space-y-4">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
