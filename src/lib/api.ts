export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiOptions = RequestInit & { auth?: boolean; cache?: "no-store" | "force-cache"; revalidate?: number };

// In-memory + localStorage cache for GETs — 60s fresh + 5min stale for near-instant (stale-while-revalidate)
const memCache = new Map<string, { data: any; expires: number; staleExpires: number }>();
function getCacheKey(path: string, auth: boolean) {
  const token = auth ? (typeof window !== "undefined" ? localStorage.getItem("folio_access")?.slice(0, 8) : "") : "";
  return `${path}::${token ?? ""}`;
}
function getCached(path: string, auth?: boolean): any | null {
  const k = getCacheKey(path, !!auth);
  const v = memCache.get(k);
  if (v && Date.now() < v.expires) return v.data;
  return null;
}
function getStale(path: string, auth?: boolean): any | null {
  const k = getCacheKey(path, !!auth);
  const v = memCache.get(k);
  if (v && Date.now() < v.staleExpires) return v.data;
  return null;
}
function setCached(path: string, auth: boolean | undefined, data: any, ttlMs = 60_000) {
  const k = getCacheKey(path, !!auth);
  memCache.set(k, { data, expires: Date.now() + ttlMs, staleExpires: Date.now() + 300_000 });
  // also persist to localStorage for reload instant
  try {
    if (typeof window !== "undefined" && ttlMs > 0) {
      localStorage.setItem(`cache:${k}`, JSON.stringify({ data, expires: Date.now() + ttlMs }));
    }
  } catch {}
}
export function clearApiCache(pathPrefix?: string) {
  if (!pathPrefix) { memCache.clear(); return; }
  for (const k of memCache.keys()) if (k.startsWith(pathPrefix)) memCache.delete(k);
}
// Hydrate from localStorage on load
if (typeof window !== "undefined") {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("cache:")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const { data, expires } = JSON.parse(raw);
          if (Date.now() < expires) {
            const k = key.slice(6);
            memCache.set(k, { data, expires, staleExpires: expires + 240_000 });
          } else localStorage.removeItem(key);
        }
      }
    }
  } catch {}
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("folio_access");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("folio_refresh");
}

let _isLoggingOut = false;
export function isLoggingOut() { return _isLoggingOut; }

export function handleGlobalLogout() {
  if (typeof window === "undefined") return;
  // Prevent re-entrant calls from multiple concurrent 401s
  if (_isLoggingOut) return;
  _isLoggingOut = true;

  localStorage.removeItem("folio_access");
  localStorage.removeItem("folio_refresh");
  localStorage.removeItem("folio_user");
  clearApiCache();
  // Cancel any pending refresh
  refreshPromise = null;

  window.dispatchEvent(new CustomEvent("auth:logout"));

  // Use replace so back-button doesn't loop back to dashboard
  if (window.location.pathname.startsWith("/dashboard") || window.location.pathname.startsWith("/onboarding")) {
    window.location.replace("/login");
  }

  // Reset after a tick so future logins can work
  setTimeout(() => { _isLoggingOut = false; }, 2000);
}

let refreshPromise: Promise<any> | null = null;

export async function apiFetch(path: string, opts: ApiOptions = {}, isRetry = false): Promise<any> {
  // If we're in the middle of logging out, reject immediately
  if (_isLoggingOut) {
    throw new Error("Session expired. Please log in again.");
  }

  const isGet = !opts.method || opts.method === "GET";
  const useCache = isGet && opts.cache !== "no-store";
  const revalidateMs = (opts.revalidate ?? 60) * 1000;

  if (useCache && !isRetry) {
    const cached = getCached(path, opts.auth);
    if (cached) return cached;
    // stale-while-revalidate: return stale instantly while revalidating in background
    const stale = getStale(path, opts.auth);
    if (stale) {
      setTimeout(() => {
        if (_isLoggingOut) return; // skip background refetch during logout
        apiFetch(path, { ...opts, cache: "no-store" }, true).catch(() => {});
      }, 0);
      return stale;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (opts.auth || getAccessToken()) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    credentials: "include",
    ...(opts.revalidate ? { next: { revalidate: opts.revalidate } as any } : {}),
  });

  // If 401 Unauthorized on an authenticated endpoint and we haven't retried yet:
  if (
    res.status === 401 &&
    !isRetry &&
    !path.includes("/api/auth/login") &&
    !path.includes("/api/auth/refresh")
  ) {
    // Already logging out — don't retry
    if (_isLoggingOut) throw new Error("Session expired. Please log in again.");

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      handleGlobalLogout();
      throw new Error("Session expired. Please log in again.");
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshApi().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      // Retry original request with newly issued access token
      return await apiFetch(path, opts, true);
    } catch {
      handleGlobalLogout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      handleGlobalLogout();
    }
    const msg = data?.message ?? data ?? `Request failed ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  if (useCache) setCached(path, opts.auth, data, revalidateMs);
  else if (!isGet) clearApiCache(path);

  // Invalidate related caches on mutation
  if (!isGet) {
    const prefix = path.split("/").slice(0, 3).join("/");
    clearApiCache(prefix);
  }

  return data;
}

// Auth API — Neon + Upstash backed, proper rotation
export type User = { id: string; email: string; username: string; fullName: string; createdAt: string };

export async function registerApi(payload: { fullName: string; email: string; username: string; password: string; confirmPassword: string }) {
  const data = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
  if (data.accessToken) localStorage.setItem("folio_access", data.accessToken);
  if (data.refreshToken) localStorage.setItem("folio_refresh", data.refreshToken);
  if (data.user) localStorage.setItem("folio_user", JSON.stringify(data.user));
  return data as { user: User; accessToken: string; refreshToken: string };
}

export async function loginApi(payload: { email: string; password: string }) {
  const data = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
  if (data.accessToken) localStorage.setItem("folio_access", data.accessToken);
  if (data.refreshToken) localStorage.setItem("folio_refresh", data.refreshToken);
  if (data.user) localStorage.setItem("folio_user", JSON.stringify(data.user));
  return data as { user: User; accessToken: string; refreshToken: string };
}

export async function refreshApi() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Refresh failed");
  }
  const data = await res.json();
  if (data.accessToken) localStorage.setItem("folio_access", data.accessToken);
  if (data.refreshToken) localStorage.setItem("folio_refresh", data.refreshToken);
  return data as { accessToken: string; refreshToken: string };
}

export async function logoutApi() {
  const refreshToken = getRefreshToken();
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });
  } catch {}
  handleGlobalLogout();
}

export async function meApi() {
  const data = await apiFetch("/api/auth/me", { method: "GET", auth: true });
  return data as { user: User };
}

// Profile — ECA showcase educational
export type Profile = { userId?: string; headline?: string | null; bio?: string | null; location?: string | null; education?: any; interests?: string[] | null; socials?: any; avatarKey?: string | null };
export async function getProfileApi() {
  const data = await apiFetch("/api/profile", { method: "GET", auth: true });
  return data as { user: User; profile: Profile };
}
export async function updateProfileApi(payload: Partial<Profile>) {
  const data = await apiFetch("/api/profile", { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { profile: Profile };
}

// Projects
export type Project = { id: string; userId: string; title: string; description?: string | null; technologies?: string[] | null; skills?: string[] | null; githubUrl?: string | null; liveUrl?: string | null; featured?: boolean; visibility?: string; createdAt?: string };
export async function listProjectsApi() {
  const data = await apiFetch("/api/projects", { method: "GET", auth: true });
  return data as { data: Project[] };
}
export async function createProjectApi(payload: any) {
  const data = await apiFetch("/api/projects", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Project };
}
export async function updateProjectApi(id: string, payload: any) {
  const data = await apiFetch(`/api/projects/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { data: Project };
}
export async function deleteProjectApi(id: string) {
  return apiFetch(`/api/projects/${id}`, { method: "DELETE", auth: true });
}

// Activities (ECA) — now with images (max 5, R2)
export type Activity = { id: string; userId: string; activityName: string; category?: string | null; organization?: string | null; role?: string | null; description?: string | null; skills?: string[] | null; images?: string[] | null; visibility?: string; createdAt?: string };
export async function listActivitiesApi() {
  const data = await apiFetch("/api/activities", { method: "GET", auth: true });
  return data as { data: Activity[] };
}
export async function createActivityApi(payload: any) {
  const data = await apiFetch("/api/activities", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Activity };
}
export async function updateActivityApi(id: string, payload: any) {
  const data = await apiFetch(`/api/activities/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { data: Activity };
}
export async function deleteActivityApi(id: string) {
  return apiFetch(`/api/activities/${id}`, { method: "DELETE", auth: true });
}

// Certificates
export type Certificate = { id: string; userId: string; name: string; organization?: string | null; issueDate?: string | null; skills?: string[] | null; credentialId?: string | null; credentialUrl?: string | null; visibility?: string; createdAt?: string };
export async function listCertificatesApi() {
  const data = await apiFetch("/api/certificates", { method: "GET", auth: true });
  return data as { data: Certificate[] };
}
export async function createCertificateApi(payload: any) {
  const data = await apiFetch("/api/certificates", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Certificate };
}
export async function updateCertificateApi(id: string, payload: any) {
  const data = await apiFetch(`/api/certificates/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { data: Certificate };
}
export async function deleteCertificateApi(id: string) {
  return apiFetch(`/api/certificates/${id}`, { method: "DELETE", auth: true });
}

// Courses
export type Course = { id: string; userId: string; name: string; provider?: string | null; instructor?: string | null; description?: string | null; skills?: string[] | null; visibility?: string; createdAt?: string };
export async function listCoursesApi() {
  const data = await apiFetch("/api/courses", { method: "GET", auth: true, revalidate: 30 });
  return data as { data: Course[] };
}
export async function createCourseApi(payload: any) {
  const data = await apiFetch("/api/courses", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Course };
}
export async function updateCourseApi(id: string, payload: any) {
  const data = await apiFetch(`/api/courses/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { data: Course };
}
export async function deleteCourseApi(id: string) {
  return apiFetch(`/api/courses/${id}`, { method: "DELETE", auth: true });
}

// Experiences
export type Experience = { id: string; userId: string; position: string; category?: string | null; organization?: string | null; location?: string | null; startDate?: string | null; endDate?: string | null; current?: boolean; description?: string | null; skills?: string[] | null; visibility?: string; createdAt?: string };
export async function listExperiencesApi() {
  const data = await apiFetch("/api/experiences", { method: "GET", auth: true, revalidate: 30 });
  return data as { data: Experience[] };
}
export async function createExperienceApi(payload: any) {
  const data = await apiFetch("/api/experiences", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Experience };
}
export async function updateExperienceApi(id: string, payload: any) {
  const data = await apiFetch(`/api/experiences/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { data: Experience };
}
export async function deleteExperienceApi(id: string) {
  return apiFetch(`/api/experiences/${id}`, { method: "DELETE", auth: true });
}

// Achievements
export type Achievement = { id: string; userId: string; title: string; category?: string | null; organization?: string | null; date?: string | null; description?: string | null; images?: string[] | null; visibility?: string; createdAt?: string };
export async function listAchievementsApi() {
  const data = await apiFetch("/api/achievements", { method: "GET", auth: true, revalidate: 30 });
  return data as { data: Achievement[] };
}
export async function createAchievementApi(payload: any) {
  const data = await apiFetch("/api/achievements", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Achievement };
}
export async function updateAchievementApi(id: string, payload: any) {
  const data = await apiFetch(`/api/achievements/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  return data as { data: Achievement };
}
export async function deleteAchievementApi(id: string) {
  return apiFetch(`/api/achievements/${id}`, { method: "DELETE", auth: true });
}

// Skills
export type Skill = { id: string; userId: string; name: string; category?: string | null; visibility?: string; createdAt?: string };
export async function listSkillsApi() {
  const data = await apiFetch("/api/skills", { method: "GET", auth: true, revalidate: 30 });
  return data as { data: Skill[] };
}
export async function createSkillApi(payload: any) {
  const data = await apiFetch("/api/skills", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Skill };
}
export async function deleteSkillApi(id: string) {
  return apiFetch(`/api/skills/${id}`, { method: "DELETE", auth: true });
}

// Documents (no R2 yet — metadata only)
export type Document = { id: string; userId: string; filename: string; originalName?: string | null; mimeType?: string | null; fileSize?: number | null; category?: string; createdAt?: string };
export async function listDocumentsApi() {
  const data = await apiFetch("/api/documents", { method: "GET", auth: true, revalidate: 30 });
  return data as { data: Document[] };
}
export async function createDocumentApi(payload: any) {
  const data = await apiFetch("/api/documents", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return data as { data: Document };
}
export async function deleteDocumentApi(id: string) {
  return apiFetch(`/api/documents/${id}`, { method: "DELETE", auth: true });
}

// Dashboard summary — single query, 30s cache, near-instant
export type DashboardSummary = {
  projects: number;
  certificates: number;
  activities: number;
  courses: number;
  experiences: number;
  achievements: number;
  skills: number;
  documents: number;
  featured: number;
  profile?: any;
  profileDone: boolean;
  hasPhoto: boolean;
  completion: number;
};
export async function getDashboardSummaryApi() {
  const data = await apiFetch("/api/dashboard", { method: "GET", auth: true, revalidate: 15 });
  return data as DashboardSummary;
}

// Public portfolio — real data, no auth, 60s cache
export type PublicPortfolio = {
  user: { id: string; username: string; fullName: string; email: string };
  profile: { headline?: string | null; bio?: string | null; location?: string | null; education?: any; interests?: string[] | null; socials?: any; avatarKey?: string | null } | null;
  projects: any[];
  activities: any[];
  certificates: any[];
  courses: any[];
  experiences: any[];
  achievements: any[];
  skills: any[];
};
export async function getPublicPortfolioApi(username: string) {
  const data = await apiFetch(`/api/portfolio/${encodeURIComponent(username)}`, { method: "GET", revalidate: 60 });
  return data as PublicPortfolio;
}

// Prefetch helper — fire-and-forget, warms cache for instant navigation
export function prefetchDashboard() {
  getDashboardSummaryApi().catch(() => {});
  getProfileApi().catch(() => {});
}
export function prefetchAll() {
  prefetchDashboard();
  listProjectsApi().catch(() => {});
  listActivitiesApi().catch(() => {});
  listCertificatesApi().catch(() => {});
  listCoursesApi().catch(() => {});
  listExperiencesApi().catch(() => {});
  listAchievementsApi().catch(() => {});
  listSkillsApi().catch(() => {});
  listDocumentsApi().catch(() => {});
}
