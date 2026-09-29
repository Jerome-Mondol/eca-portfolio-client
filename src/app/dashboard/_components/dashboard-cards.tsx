import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { FolderKanban, Award, Briefcase, Trophy } from "lucide-react";
import type { DashboardSummary } from "@/lib/api";

/** The summary minus the derived `completion` percentage. */
export type DashboardCounts = Omit<DashboardSummary, "completion">;

type StatTile = { label: string; value: number | string; hint: string; icon: typeof FolderKanban };

/** The four headline counts, each with its own caption. */
export function DashboardStatGrid({ stats }: { stats: DashboardCounts }) {
  const tiles: StatTile[] = [
    { label: "Projects", value: stats.projects, hint: `${stats.featured} featured`, icon: FolderKanban },
    { label: "Certificates", value: stats.certificates, hint: stats.certificates > 0 ? "added" : "none yet", icon: Award },
    { label: "ECA", value: stats.activities, hint: stats.activities > 0 ? "activities" : "add one", icon: Trophy },
    { label: "Courses", value: stats.courses, hint: stats.courses > 0 ? "courses" : "none", icon: Briefcase },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <Card key={tile.label} className="p-3 sm:p-4 min-w-0">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 truncate">
              <Icon size={14} className="shrink-0" /> {tile.label}
            </p>
            <p className="text-xl sm:text-2xl font-semibold mt-2">{tile.value}</p>
            <p className="text-xs text-muted mt-1">{tile.hint}</p>
          </Card>
        );
      })}
    </div>
  );
}

/** The single-row scoreboard across every section. */
export function DashboardScoreboard({ stats, completion }: { stats: DashboardCounts; completion: number }) {
  const cells: StatTile[] = [
    { label: "ECA", value: stats.activities, hint: "", icon: Trophy },
    { label: "Projects", value: stats.projects, hint: "", icon: FolderKanban },
    { label: "Certificates", value: stats.certificates, hint: "", icon: Award },
    { label: "Courses", value: stats.courses, hint: "", icon: Briefcase },
    { label: "Featured", value: stats.featured, hint: "", icon: Trophy },
    { label: "Complete", value: `${completion}%`, hint: "", icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {cells.map((cell) => (
        <Card key={cell.label} className="p-3 text-center">
          <p className="text-xs text-muted-foreground">{cell.label}</p>
          <p className="text-lg font-semibold mt-1">{cell.value}</p>
        </Card>
      ))}
    </div>
  );
}

/** Completion percentage with the progress bar. */
export function DashboardProgressCard({ stats, completion }: { stats: DashboardCounts; completion: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio • {completion}%</CardTitle>
            <CardDescription>
              {stats.profileDone ? "Profile started" : "Add your headline to begin"} • {stats.projects} projects • {stats.activities} ECA
            </CardDescription>
          </div>
          <span className="text-xl font-semibold">{completion}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-surface-2 overflow-hidden">
          <div className="h-full bg-primary-strong rounded-full transition-all" style={{ width: `${completion}%` }} />
        </div>
      </CardHeader>
    </Card>
  );
}

/** Checklist of the setup steps still worth doing. */
export function DashboardNextSteps({ steps }: { steps: { label: string; href: string; done: boolean }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step) => (
          <Link key={step.label} href={step.href} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:bg-surface-2 cursor-pointer">
            <span
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm border shrink-0 ${
                step.done ? "bg-primary-strong text-white border-primary-strong" : "bg-card border-border"
              }`}
            >
              {step.done ? "✓" : "+"}
            </span>
            <span className={`text-sm font-medium ${step.done ? "line-through text-muted-foreground" : ""}`}>{step.label}</span>
            <span className="ml-auto text-muted-foreground">→</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
