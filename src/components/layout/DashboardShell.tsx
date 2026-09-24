"use client";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import Link from "next/link";
import { Menu, Bell, Search, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { AddSheet } from "@/components/AddSheet";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();

  // Redirect to login if not authenticated (after loading)
  useEffect(() => {
    if (!loading && !user) {
      const token = typeof window !== "undefined" ? localStorage.getItem("folio_access") : null;
      if (!token) router.replace("/login");
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      success("Signed out", "See you soon");
      router.push("/login");
    } catch (e: any) {
      toastError("Logout failed", e.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header mobile/desktop — 56px compact per spec */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-[#ececef] supports-[backdrop-filter]:bg-white/75">
          <div className="flex items-center gap-2 px-3 sm:px-6 h-[56px] max-w-[1100px] w-full mx-auto">
            {/* mobile hamburger — 44px tap target */}
            <button
              className="lg:hidden h-11 w-11 shrink-0 rounded-full border border-[#e8e8ea] bg-white flex items-center justify-center active:bg-[#f3f3f5] transition"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2 min-h-[44px] px-1">
              <div className="h-7 w-7 rounded-lg bg-[#111827] flex items-center justify-center text-white text-xs font-bold shrink-0">◈</div>
              <span className="font-semibold text-[15px] tracking-tight">folio</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[420px] ml-1">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a94] pointer-events-none" />
                <input
                  placeholder="Search projects, certificates..."
                  className="w-full h-10 pl-9 pr-3 rounded-full border border-[#e8e8ea] bg-[#f8f8f9] text-[14px] placeholder:text-[#8a8a94] focus:outline-none focus:bg-white focus:border-[#d0d0d6] focus:ring-2 focus:ring-[#111827]/[0.06] transition"
                  aria-label="Search"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setAddOpen(true)}
                className="hidden sm:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#111827] text-white text-[14px] font-medium hover:bg-black active:scale-[0.98] transition"
              >
                ＋ Add
              </button>
              <button className="h-11 w-11 shrink-0 rounded-full border border-[#e8e8ea] bg-white flex items-center justify-center relative active:bg-[#f3f3f5]" aria-label="Notifications">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-[#ef4444] rounded-full border-2 border-white" />
              </button>
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.fullName || user.username)}`}
                    alt={user.fullName}
                    className="h-11 w-11 shrink-0 rounded-full border border-[#e8e8ea] object-cover bg-white"
                    width={44}
                    height={44}
                  />
                  <button onClick={handleLogout} className="h-11 w-11 shrink-0 rounded-full border border-[#e8e8ea] bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition" aria-label="Log out">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <img
                  src="https://api.dicebear.com/9.x/initials/svg?seed=John%20Doe"
                  alt="avatar"
                  className="h-11 w-11 shrink-0 rounded-full border border-[#e8e8ea] object-cover bg-white"
                  width={44}
                  height={44}
                />
              )}
              {/* mobile avatar */}
              {user && (
                <div className="sm:hidden flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.fullName || user.username)}`}
                    alt={user.fullName}
                    className="h-11 w-11 shrink-0 rounded-full border border-[#e8e8ea] object-cover bg-white"
                    width={44}
                    height={44}
                  />
                </div>
              )}
            </div>
          </div>

          {/* mobile search — visible only at <640px, 320px-friendly */}
          <div className="sm:hidden px-3 pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a94] pointer-events-none" />
              <input
                placeholder="Search projects, certificates, experiences..."
                className="w-full h-11 pl-9 pr-3 rounded-full border border-[#e8e8ea] bg-[#f8f8f9] text-[14px] placeholder:text-[#8a8a94] focus:outline-none focus:bg-white focus:border-[#d0d0d6]"
                aria-label="Search on mobile"
              />
            </div>
          </div>

          {/* mobile menu drawer — full tap targets */}
          {mobileMenu && (
            <div className="lg:hidden border-t border-[#ececef] bg-white px-3 py-3 grid grid-cols-2 gap-2">
              <Link href="/dashboard" className="min-h-[44px] px-3 py-3 rounded-xl bg-[#f3f3f5] text-sm font-medium flex items-center" onClick={() => setMobileMenu(false)}>
                Dashboard
              </Link>
              <Link href="/dashboard/projects" className="min-h-[44px] px-3 py-3 rounded-xl bg-[#f3f3f5] text-sm font-medium flex items-center" onClick={() => setMobileMenu(false)}>
                Projects
              </Link>
              <Link href="/dashboard/certificates" className="min-h-[44px] px-3 py-3 rounded-xl bg-[#f3f3f5] text-sm font-medium flex items-center" onClick={() => setMobileMenu(false)}>
                Certificates
              </Link>
              <Link href="/dashboard/eca" className="min-h-[44px] px-3 py-3 rounded-xl bg-[#f3f3f5] text-sm font-medium flex items-center" onClick={() => setMobileMenu(false)}>
                ECA
              </Link>
              <Link href="/dashboard/skills" className="min-h-[44px] px-3 py-3 rounded-xl bg-[#f3f3f5] text-sm font-medium flex items-center" onClick={() => setMobileMenu(false)}>
                Skills
              </Link>
              <Link href="/dashboard/ai" className="min-h-[44px] px-3 py-3 rounded-xl bg-[#f3f3f5] text-sm font-medium flex items-center" onClick={() => setMobileMenu(false)}>
                AI Assistant
              </Link>
              {user && (
                <button onClick={() => { setMobileMenu(false); handleLogout(); }} className="col-span-2 min-h-[44px] px-3 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-center gap-2">
                  <LogOut size={16} /> Log out ({user.username})
                </button>
              )}
              <Link href={user ? `/u/${user.username}` : "/u/john-doe"} className="col-span-2 min-h-[44px] px-3 py-3 rounded-xl bg-[#111827] text-white text-sm font-medium text-center flex items-center justify-center" onClick={() => setMobileMenu(false)}>
                View public portfolio →
              </Link>
            </div>
          )}
        </header>

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-6 max-w-[1100px] w-full mx-auto overflow-x-hidden">{children}</main>
      </div>
      <BottomNav />
      <AddSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
