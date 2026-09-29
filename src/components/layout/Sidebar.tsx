"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
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

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen overflow-y-auto">
      <div className="h-[56px] flex items-center gap-2 px-5 border-b border-border shrink-0">
        <div className="h-7 w-7 rounded-lg bg-primary-strong flex items-center justify-center text-[13px] font-bold">◈</div>
        <span className="text-[15px] font-semibold tracking-tight">proofolio</span>
        <span className="ml-auto text-xs text-muted-foreground">v1.0</span>
      </div>
      <nav className="p-3 space-y-0.5 flex-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              // The resource store is warmed on shell mount, so data is already
              // in memory. Prefetching the route instead makes the click instant.
              prefetch
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-medium transition cursor-pointer",
                active ? "bg-primary-strong text-white shadow-sm" : "text-muted-strong hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <item.icon size={16} className={cn(active ? "text-white" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border space-y-3">
        {user && (
          <div className="flex items-center gap-2.5 rounded-xl bg-surface-2 border border-border p-2.5">
            <Avatar name={user.fullName || user.username} className="h-8 w-8 rounded-full border border-border" ratio={0.45} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{user.fullName}</p>
              <p className="text-xs text-muted truncate">@{user.username}</p>
            </div>
          </div>
        )}
        <Link href={user ? `/u/${user.username}` : "/login"} className="flex items-center justify-center rounded-full bg-card border border-border h-9 text-sm font-medium hover:bg-surface-2 transition">
          View public portfolio →
        </Link>
        {user && (
          <button
            onClick={async () => {
              await logout();
              success("Signed out");
              router.push("/login");
            }}
            className="w-full flex items-center justify-center rounded-full bg-card border border-red-200 text-red-600 h-9 text-sm font-medium hover:bg-red-50 transition cursor-pointer"
          >
            Log out
          </button>
        )}
      </div>
    </aside>
  );
}

