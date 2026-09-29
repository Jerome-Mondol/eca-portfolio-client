import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streaming fallback for `/u/[username]`.
 *
 * It mirrors the real page section-for-section — header, hero, then the
 * content bands — so the layout does not jump when the data lands. The old
 * fallback was three stacked grey bars that matched nothing.
 */
export default function Loading() {
  return (
    <div className="min-h-screen page-warm overflow-x-hidden">
      {/* header */}
      <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1080px] px-3 sm:px-6 h-[56px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-border" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="hidden sm:block h-3 w-32" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* hero */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start">
          <div className="text-center lg:text-left min-w-0">
            <div className="flex justify-center lg:justify-start">
              <Skeleton className="h-32 w-32 sm:h-36 sm:w-36 rounded-[28px]" />
            </div>
            <Skeleton className="mt-4 h-7 w-56 max-w-full mx-auto lg:mx-0" />
            <Skeleton className="mt-2 h-4 w-40 max-w-full mx-auto lg:mx-0" />
            <div className="mt-4 space-y-2 max-w-[560px] mx-auto lg:mx-0">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-[85%]" />
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
              <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
              <Skeleton className="h-11 w-full sm:w-36 rounded-lg" />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center lg:justify-start">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* content bands */}
      {[0, 1, 2].map((band) => (
        <section key={band} className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <Skeleton className="h-5 w-40" />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((card) => (
              <div key={card} className="rounded-xl border border-border bg-card p-4">
                <Skeleton className="h-36 w-full rounded-xl" />
                <Skeleton className="mt-3 h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
