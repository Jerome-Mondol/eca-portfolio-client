"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowUpRight, Eye, FolderKanban, Award, Briefcase, Trophy, Sparkles, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfileApi, listProjectsApi, listCertificatesApi, listActivitiesApi, listCoursesApi } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ projects: 0, certificates: 0, activities: 0, courses: 0, profileDone: false, hasPhoto: false });
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([getProfileApi().catch(() => null), listProjectsApi().catch(() => ({ data: [] })), listCertificatesApi().catch(() => ({ data: [] })), listActivitiesApi().catch(() => ({ data: [] })), listCoursesApi().catch(() => ({ data: [] }))]).then(
      ([profileRes, projRes, certRes, actRes, courseRes]) => {
        if (!mounted) return;
        const profile: any = (profileRes as any)?.value?.profile;
        const projects: any[] = (projRes as any)?.value?.data ?? [];
        const certs: any[] = (certRes as any)?.value?.data ?? [];
        const acts: any[] = (actRes as any)?.value?.data ?? [];
        const courses: any[] = (courseRes as any)?.value?.data ?? [];
        const profileDone = !!(profile?.headline || profile?.bio || profile?.location);
        const hasPhoto = !!profile?.avatarKey;
        setStats({ projects: projects.length, certificates: certs.length, activities: acts.length, courses: courses.length, profileDone, hasPhoto });
        setFeatured(projects.filter((p: any) => p.featured).length);
        setLoading(false);
      }
    );
    return () => { mounted = false; };
  }, []);

  const completion = (() => {
    // 6 steps: profile, projects, certificates, activities, courses, photo
    const steps = [stats.profileDone, stats.projects > 0, stats.certificates > 0, stats.activities > 0, stats.courses > 0, stats.hasPhoto];
    const done = steps.filter(Boolean).length;
    return Math.round((done / steps.length) * 100);
  })();

  const nextSteps = [
    { label: "Add profile photo", href: "/dashboard/profile", done: stats.hasPhoto },
    { label: "Add project", href: "/dashboard/projects", done: stats.projects > 0 },
    { label: "Add certificate", href: "/dashboard/certificates", done: stats.certificates > 0 },
    { label: "Add ECA", href: "/dashboard/eca", done: stats.activities > 0 },
    { label: "Add course", href: "/dashboard/courses", done: stats.courses > 0 },
  ];

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  if (loading) {
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

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Good morning, {firstName} 👋</h1>
          <p className="text-sm text-[#6b6b76] mt-1">
            {completion === 100 ? "Portfolio complete — great work!" : `${completion}% complete • ${nextSteps.filter((s) => !s.done).length} steps left`}
          </p>
        </div>
        <Link href={user ? `/u/${user.username}` : "/u/john-doe"} className="inline-flex items-center justify-center gap-1.5 text-sm font-medium border border-[#e8e8ea] bg-white rounded-full px-4 min-h-[44px] py-2 hover:bg-[#f8f8f9] w-full sm:w-auto shrink-0 cursor-pointer">
          View portfolio <ArrowUpRight size={14} />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio • {completion}%</CardTitle>
              <CardDescription>{stats.profileDone ? "Profile started" : "Add your headline to begin"} • {stats.projects} projects • {stats.activities} ECA</CardDescription>
            </div>
            <span className="text-xl font-semibold">{completion}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#f0f0f2] overflow-hidden">
            <div className="h-full bg-[#111827] rounded-full transition-all" style={{ width: `${completion}%` }} />
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextSteps.map((a) => (
              <Link key={a.label} href={a.href} className="flex items-center gap-3 rounded-xl border border-[#e8e8ea] px-4 py-3 hover:bg-[#f8f8f9] cursor-pointer">
                <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm border shrink-0 ${a.done ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea]"}`}>{a.done ? "✓" : "+"}</span>
                <span className={`text-sm font-medium ${a.done ? "line-through text-[#8a8a94]" : ""}`}>{a.label}</span>
                <span className="ml-auto text-[#8a8a94]">→</span>
              </Link>
            ))}
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4 min-w-0">
            <p className="text-xs text-[#8a8a94] font-medium flex items-center gap-1 truncate"><FolderKanban size={14} className="shrink-0" /> Projects</p>
            <p className="text-xl sm:text-2xl font-semibold mt-2">{stats.projects}</p>
            <p className="text-xs text-[#6b6b76] mt-1">{featured} featured</p>
          </Card>
          <Card className="p-3 sm:p-4 min-w-0">
            <p className="text-xs text-[#8a8a94] font-medium flex items-center gap-1 truncate"><Award size={14} className="shrink-0" /> Certificates</p>
            <p className="text-xl sm:text-2xl font-semibold mt-2">{stats.certificates}</p>
            <p className="text-xs text-[#6b6b76] mt-1">{stats.certificates > 0 ? "added" : "none yet"}</p>
          </Card>
          <Card className="p-3 sm:p-4 min-w-0">
            <p className="text-xs text-[#8a8a94] font-medium flex items-center gap-1 truncate"><Trophy size={14} className="shrink-0" /> ECA</p>
            <p className="text-xl sm:text-2xl font-semibold mt-2">{stats.activities}</p>
            <p className="text-xs text-[#6b6b76] mt-1">{stats.activities > 0 ? "activities" : "add one"}</p>
          </Card>
          <Card className="p-3 sm:p-4 min-w-0">
            <p className="text-xs text-[#8a8a94] font-medium flex items-center gap-1 truncate"><Briefcase size={14} className="shrink-0" /> Courses</p>
            <p className="text-xl sm:text-2xl font-semibold mt-2">{stats.courses}</p>
            <p className="text-xs text-[#6b6b76] mt-1">{stats.courses > 0 ? "courses" : "none"}</p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {[
          { k: "ECA", v: stats.activities },
          { k: "Projects", v: stats.projects },
          { k: "Certificates", v: stats.certificates },
          { k: "Courses", v: stats.courses },
          { k: "Featured", v: featured },
          { k: "Complete", v: `${completion}%` },
        ].map((s) => (
          <Card key={s.k} className="p-3 text-center">
            <p className="text-xs text-[#8a8a94]">{s.k}</p>
            <p className="text-lg font-semibold mt-1">{s.v}</p>
          </Card>
        ))}
      </div>

      <Card className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm font-semibold">Quick add</p>
        <div className="flex gap-2 flex-wrap">
          <Link href="/dashboard/projects" className="cursor-pointer"><Button size="sm"><Plus size={14} className="mr-1" /> Project</Button></Link>
          <Link href="/dashboard/certificates" className="cursor-pointer"><Button variant="secondary" size="sm">Certificate</Button></Link>
          <Link href="/dashboard/eca" className="cursor-pointer"><Button variant="secondary" size="sm">ECA</Button></Link>
          <Link href="/dashboard/courses" className="cursor-pointer"><Button variant="secondary" size="sm">Course</Button></Link>
        </div>
      </Card>

      {completion < 100 && (
        <Card className="p-3 border-[#e8e8ea] bg-[#f8f8f9]">
          <p className="text-xs font-medium">Tip</p>
          <p className="text-sm text-[#6b6b76] mt-1">ECA leads your educational story. Add one activity and one certificate to reach 50% instantly.</p>
        </Card>
      )}
    </div>
  );
}
