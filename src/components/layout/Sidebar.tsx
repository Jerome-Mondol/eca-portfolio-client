"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Briefcase,
  Trophy,
  GraduationCap,
  Award,
  Sparkles,
  BarChart3,
  FileText,
  Layers,
  Settings,
  Lightbulb,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/eca", label: "ECA & Activities", icon: Trophy },
  { href: "/dashboard/courses", label: "Courses", icon: GraduationCap },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/achievements", label: "Achievements", icon: Layers },
  { href: "/dashboard/skills", label: "Skills", icon: Lightbulb },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/dashboard/portfolio", label: "My Portfolio", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { success } = useToast();

  const prefetch = (href: string) => {
    import("@/lib/api").then((api) => {
      if (href === "/dashboard") api.getDashboardSummaryApi().catch(() => {});
      else if (href === "/dashboard/profile") api.getProfileApi().catch(() => {});
      else if (href === "/dashboard/projects") api.listProjectsApi().catch(() => {});
      else if (href === "/dashboard/experience") api.listExperiencesApi().catch(() => {});
      else if (href === "/dashboard/eca") api.listActivitiesApi().catch(() => {});
      else if (href === "/dashboard/courses") api.listCoursesApi().catch(() => {});
      else if (href === "/dashboard/certificates") api.listCertificatesApi().catch(() => {});
      else if (href === "/dashboard/achievements") api.listAchievementsApi().catch(() => {});
      else if (href === "/dashboard/skills") api.listSkillsApi().catch(() => {});
      else if (href === "/dashboard/documents") api.listDocumentsApi().catch(() => {});
    });
  };
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-[#ececef] bg-white sticky top-0 h-screen overflow-y-auto">
      <div className="h-[56px] flex items-center gap-2 px-5 border-b border-[#ececef] shrink-0">
        <div className="h-7 w-7 rounded-lg bg-[#111827] flex items-center justify-center text-white text-[13px] font-bold">◈</div>
        <span className="text-[15px] font-semibold tracking-tight">folio</span>
        <span className="ml-auto text-xs text-[#8a8a94]">v1.0</span>
      </div>
      <nav className="p-3 space-y-0.5 flex-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => prefetch(item.href)}
              onFocus={() => prefetch(item.href)}
              prefetch
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-medium transition cursor-pointer",
                active ? "bg-[#111827] text-white shadow-sm" : "text-[#4a4a52] hover:bg-[#f6f6f7] hover:text-[#111827]"
              )}
            >
              <item.icon size={16} className={cn(active ? "text-white" : "text-[#8a8a94]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#ececef] space-y-3">
        {user && (
          <div className="flex items-center gap-2.5 rounded-xl bg-[#f8f8f9] border border-[#e8e8ea] p-2.5">
            <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.fullName || user.username)}`} alt={user.fullName} className="h-8 w-8 rounded-full border border-[#e8e8ea] bg-white" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{user.fullName}</p>
              <p className="text-xs text-[#6b6b76] truncate">@{user.username}</p>
            </div>
          </div>
        )}
        <div className="rounded-2xl bg-[#f8f8f9] border border-[#e8e8ea] p-3">
          <p className="text-xs font-semibold">Portfolio views</p>
          <p className="text-xl font-semibold tracking-tight mt-1">1,248</p>
          <p className="text-xs text-[#6b6b76]">+24 this week</p>
        </div>
        <Link href={user ? `/u/${user.username}` : "/login"} className="flex items-center justify-center rounded-full bg-white border border-[#e8e8ea] h-9 text-sm font-medium hover:bg-[#f3f3f5] transition">
          View public portfolio →
        </Link>
        {user && (
          <button
            onClick={async () => {
              await logout();
              success("Signed out");
              router.push("/login");
            }}
            className="w-full flex items-center justify-center rounded-full bg-white border border-red-200 text-red-600 h-9 text-sm font-medium hover:bg-red-50 transition cursor-pointer"
          >
            Log out
          </button>
        )}
      </div>
    </aside>
  );
}
