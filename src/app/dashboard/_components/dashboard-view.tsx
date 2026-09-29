"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardSummaryApi, type DashboardSummary } from "@/lib/api";
import { useResource } from "@/lib/store";
import { DashboardProgressCard, DashboardNextSteps, DashboardStatGrid, DashboardScoreboard, type DashboardCounts } from "./dashboard-cards";

/** Every count defaults to zero so the layout never depends on the fetch. */
const EMPTY_STATS: DashboardCounts = {
  projects: 0,
  certificates: 0,
  activities: 0,
  courses: 0,
  experiences: 0,
  achievements: 0,
  skills: 0,
  documents: 0,
  featured: 0,
  profileDone: false,
  hasPhoto: false,
};

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
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

export function DashboardView() {
  const { user } = useAuth();
  // Reads from the warmed store, so a revisit paints immediately with no fetch.
  const { data, loading } = useResource<DashboardSummary>("dashboard", getDashboardSummaryApi);

  const stats = data ?? EMPTY_STATS;
  const completion = data?.completion ?? 0;

  const nextSteps = [
    { label: "Add profile photo", href: "/dashboard/profile", done: stats.hasPhoto },
    { label: "Add project", href: "/dashboard/projects", done: stats.projects > 0 },
    { label: "Add certificate", href: "/dashboard/certificates", done: stats.certificates > 0 },
    { label: "Add ECA", href: "/dashboard/eca", done: stats.activities > 0 },
    { label: "Add course", href: "/dashboard/courses", done: stats.courses > 0 },
  ];

  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const remaining = nextSteps.filter((step) => !step.done).length;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Good morning, {firstName} 👋</h1>
          <p className="text-sm text-muted mt-1">
            {completion === 100 ? "Portfolio complete — great work!" : `${completion}% complete • ${remaining} steps left`}
          </p>
        </div>
        <Link
          href={user ? `/u/${user.username}` : "/u/john-doe"}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium border border-border bg-card rounded-full px-4 min-h-[44px] py-2 hover:bg-surface-2 w-full sm:w-auto shrink-0 cursor-pointer"
        >
          View portfolio <ArrowUpRight size={14} />
        </Link>
      </div>

      <DashboardProgressCard stats={stats} completion={completion} />

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-4">
        <DashboardNextSteps steps={nextSteps} />
        <DashboardStatGrid stats={stats} />
      </div>

      <DashboardScoreboard stats={stats} completion={completion} />
    </div>
  );
}
