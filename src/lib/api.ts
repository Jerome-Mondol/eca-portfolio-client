import { clearResourceStore, invalidateResource, loadResource, onIdle, readResource, writeResource } from "./store";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiOptions = RequestInit & { auth?: boolean; noStore?: boolean };

/* -------------------------------------------------------------------------- */
/* tokens                                                                     */
/* -------------------------------------------------------------------------- */

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("proofolio_access");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("proofolio_refresh");
}

let _isLoggingOut = false;
export function isLoggingOut() {
  return _isLoggingOut;
}

export function handleGlobalLogout() {
  if (typeof window === "undefined") return;
  // Prevent re-entrant calls from multiple concurrent 401s
  if (_isLoggingOut) return;
  _isLoggingOut = true;

  localStorage.removeItem("proofolio_access");
  localStorage.removeItem("proofolio_refresh");
  localStorage.removeItem("proofolio_user");
  clearResourceStore();
  // Cancel any pending refresh
  refreshPromise = null;

  window.dispatchEvent(new CustomEvent("auth:logout"));

  // Use replace so back-button doesn't loop back to dashboard
  if (window.location.pathname.startsWith("/dashboard") || window.location.pathname.startsWith("/onboarding")) {
    window.location.replace("/login");
  }

  // Reset after a tick so future logins can work
  setTimeout(() => {
    _isLoggingOut = false;
  }, 2000);
}

let refreshPromise: Promise<any> | null = null;

/* -------------------------------------------------------------------------- */
/* network layer                                                              */
/* -------------------------------------------------------------------------- */

export async function apiFetch(path: string, opts: ApiOptions = {}, isRetry = false): Promise<any> {
  // If we're in the middle of logging out, reject immediately
  if (_isLoggingOut) {
    throw new Error("Session expired. Please log in again.");
  }

  const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const headers: Record<string, string> = {
    // For multipart the browser must pick the boundary itself, so we omit it.
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(opts.headers as Record<string, string> | undefined),
  };
  const token = getAccessToken();
  if (opts.auth || token) {
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const { noStore, ...init } = opts;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    // Authenticated payloads must never land in a shared cache; we own caching.
    cache: noStore ? "no-store" : init.cache,
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

  return data;
}

/* -------------------------------------------------------------------------- */
/* cached resource helpers                                                    */
/* -------------------------------------------------------------------------- */

/** GET that reads through the store: instant when warm, shared when concurrent. */
function cachedGet<T>(key: string, path: string, opts: ApiOptions = {}): Promise<T> {
  return loadResource<T>(key, () => apiFetch(path, { auth: true, ...opts }));
}

/**
 * Invalidate a list resource after a mutation and seed the response straight
 * into the store so the UI updates without waiting for a round trip.
 */
function seedList<T>(key: string, data: T) {
  const existing = readResource<any>(key);
  if (existing && typeof existing === "object" && "data" in existing) {
    writeResource(key, { ...existing, data });
  } else {
    writeResource(key, { data });
  }
  invalidateResource("dashboard");
}

/* -------------------------------------------------------------------------- */
/* Auth API — Neon + Upstash backed, proper rotation                          */
/* -------------------------------------------------------------------------- */

export type User = { id: string; email: string; username: string; fullName: string; createdAt: string };

export async function registerApi(payload: { fullName: string; email: string; username: string; password: string; confirmPassword: string }) {
  const data = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
  if (data.accessToken) localStorage.setItem("proofolio_access", data.accessToken);
  if (data.refreshToken) localStorage.setItem("proofolio_refresh", data.refreshToken);
  if (data.user) localStorage.setItem("proofolio_user", JSON.stringify(data.user));
  return data as { user: User; accessToken: string; refreshToken: string };
}

export async function loginApi(payload: { email: string; password: string }) {
  const data = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
  if (data.accessToken) localStorage.setItem("proofolio_access", data.accessToken);
  if (data.refreshToken) localStorage.setItem("proofolio_refresh", data.refreshToken);
  if (data.user) localStorage.setItem("proofolio_user", JSON.stringify(data.user));
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
  if (data.accessToken) localStorage.setItem("proofolio_access", data.accessToken);
  if (data.refreshToken) localStorage.setItem("proofolio_refresh", data.refreshToken);
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
  const data = await apiFetch("/api/auth/me", { method: "GET", auth: true, noStore: true });
  return data as { user: User };
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export type Profile = { userId?: string; headline?: string | null; bio?: string | null; location?: string | null; education?: any; interests?: string[] | null; socials?: any; avatarKey?: string | null };
export async function getProfileApi() {
  return cachedGet<{ user: User; profile: Profile }>("profile", "/api/profile");
}
export async function updateProfileApi(payload: Partial<Profile>) {
  const data = await apiFetch("/api/profile", { method: "PUT", auth: true, body: JSON.stringify(payload) });
  // Reflect the write locally so the profile page and header update instantly.
  const existing = readResource<{ user: User; profile: Profile }>("profile");
  if (existing) {
    writeResource("profile", {
      user: data.user ?? existing.user,
      profile: { ...existing.profile, ...(data.profile ?? {}) },
    });
  }
  invalidateResource("dashboard");
  return data as { profile: Profile };
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export type ProjectLink = { platform: string; url: string; verified?: boolean; statusText?: string };
export type Project = { id: string; userId: string; title: string; description?: string | null; technologies?: string[] | null; skills?: string[] | null; githubUrl?: string | null; liveUrl?: string | null; links?: ProjectLink[] | null; coverImage?: string | null; featured?: boolean; visibility?: string; createdAt?: string };
export async function listProjectsApi() {
  return cachedGet<{ data: Project[] }>("projects", "/api/projects");
}
export async function createProjectApi(payload: any) {
  const data = await apiFetch("/api/projects", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Project[] }>("projects")?.data ?? [];
  seedList("projects", [data.data, ...current]);
  return data as { data: Project };
}
export async function updateProjectApi(id: string, payload: any) {
  const data = await apiFetch(`/api/projects/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Project[] }>("projects")?.data ?? [];
  seedList("projects", current.map((p) => (p.id === id ? data.data : p)));
  return data as { data: Project };
}
export async function deleteProjectApi(id: string) {
  const res = await apiFetch(`/api/projects/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Project[] }>("projects")?.data ?? [];
  seedList("projects", current.filter((p) => p.id !== id));
  return res;
}
export async function verifyProjectLinkApi(url: string) {
  const data = await apiFetch("/api/projects/verify-link", { method: "POST", auth: true, body: JSON.stringify({ url }) });
  return data as { valid: boolean; url: string; status?: number; statusText?: string; domain?: string; message: string };
}

/* -------------------------------------------------------------------------- */
/* Activities (ECA)                                                           */
/* -------------------------------------------------------------------------- */

export type Activity = { id: string; userId: string; activityName: string; category?: string | null; organization?: string | null; role?: string | null; description?: string | null; skills?: string[] | null; images?: string[] | null; visibility?: string; createdAt?: string };
export async function listActivitiesApi() {
  return cachedGet<{ data: Activity[] }>("activities", "/api/activities");
}
export async function createActivityApi(payload: any) {
  const data = await apiFetch("/api/activities", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Activity[] }>("activities")?.data ?? [];
  seedList("activities", [data.data, ...current]);
  return data as { data: Activity };
}
export async function updateActivityApi(id: string, payload: any) {
  const data = await apiFetch(`/api/activities/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Activity[] }>("activities")?.data ?? [];
  seedList("activities", current.map((x) => (x.id === id ? data.data : x)));
  return data as { data: Activity };
}
export async function deleteActivityApi(id: string) {
  const res = await apiFetch(`/api/activities/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Activity[] }>("activities")?.data ?? [];
  seedList("activities", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* Certificates                                                               */
/* -------------------------------------------------------------------------- */

export type Certificate = { id: string; userId: string; name: string; organization?: string | null; issueDate?: string | null; skills?: string[] | null; credentialId?: string | null; credentialUrl?: string | null; documentKey?: string | null; documentName?: string | null; visibility?: string; aiAnalysis?: AiAnalysis | null; createdAt?: string };
export async function listCertificatesApi() {
  return cachedGet<{ data: Certificate[] }>("certificates", "/api/certificates");
}
export async function createCertificateApi(payload: any) {
  const data = await apiFetch("/api/certificates", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Certificate[] }>("certificates")?.data ?? [];
  seedList("certificates", [data.data, ...current]);
  return data as { data: Certificate };
}
export async function updateCertificateApi(id: string, payload: any) {
  const data = await apiFetch(`/api/certificates/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Certificate[] }>("certificates")?.data ?? [];
  seedList("certificates", current.map((x) => (x.id === id ? data.data : x)));
  return data as { data: Certificate };
}
export async function deleteCertificateApi(id: string) {
  const res = await apiFetch(`/api/certificates/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Certificate[] }>("certificates")?.data ?? [];
  seedList("certificates", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* AI certificate analysis                                                     */
/* -------------------------------------------------------------------------- */

export type AiCheck = { key: string; label: string; passed: boolean; weight: number; reason: string };
export type AiSource = { title: string | null; url: string };
export type AiAnalysis = {
  certificateId?: string;
  type: "certificate";
  version: number;
  model: string;
  score: number;
  status: "verified" | "partially_verified" | "unverified";
  checks: AiCheck[];
  analyzedAt: string;
  extracted: {
    documentType: string;
    legibility: number;
    courseName: string | null;
    organization: string | null;
    date: string | null;
    certificateId: string | null;
    credentialUrl: string | null;
    skills: string[];
    rawTextExcerpt: string | null;
  };
  research: {
    issuerStatus: "found" | "not_found" | "inconclusive";
    issuerName: string | null;
    issuerDescription: string | null;
    accreditation: string | null;
    credentialUrlStatus: "resolves" | "broken" | "not_checked";
    evidence: string[];
    sources: AiSource[];
    unavailable: boolean;
    error?: string;
  };
};

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Runs the full extract -> research -> score pipeline. This is a slow call
 * (10-25s) and there is no cancellation, so the UI must show progress rather
 * than an empty spinner.
 */
export async function analyzeCertificateApi(file: File, certificateId?: string) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("That file is too large. Keep it under 10 MB.");
  }
  const form = new FormData();
  form.append("file", file);
  if (certificateId) form.append("certificateId", certificateId);

  const data = await apiFetch("/api/ai/certificates/analyze", {
    method: "POST",
    auth: true,
    body: form,
  });

  // Reflect the saved analysis in the cached certificate list.
  const savedId = (data.data as AiAnalysis).certificateId;
  if (savedId) {
    const current = readResource<{ data: Certificate[] }>("certificates")?.data ?? [];
    seedList(
      "certificates",
      current.map((x) => (x.id === savedId ? { ...x, aiAnalysis: data.data } : x)),
    );
  }
  return data as { data: AiAnalysis };
}

/* -------------------------------------------------------------------------- */
/* AI project description improvement                                          */
/* -------------------------------------------------------------------------- */

export type AiMissingInfo = {
  field: "outcome" | "metric" | "role" | "users" | "tech" | "scope" | "link";
  question: string;
  why: string;
};

export type AiProjectSuggestion = {
  description: string;
  title: string | null;
  technologies: string[];
  highlights: string[];
  missing: AiMissingInfo[];
  confidence: number;
};

/**
 * Returns a proposal only. Nothing is saved — the student accepts, edits or
 * rejects, and saving goes through /api/projects like any other edit.
 */
export async function improveProjectApi(payload: { description: string; title?: string | null }) {
  return (await apiFetch("/api/ai/projects/improve", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  })) as { data: AiProjectSuggestion };
}

/* -------------------------------------------------------------------------- */
/* Courses                                                                    */
/* -------------------------------------------------------------------------- */

export type Course = { id: string; userId: string; name: string; provider?: string | null; instructor?: string | null; description?: string | null; skills?: string[] | null; visibility?: string; createdAt?: string };
export async function listCoursesApi() {
  return cachedGet<{ data: Course[] }>("courses", "/api/courses");
}
export async function createCourseApi(payload: any) {
  const data = await apiFetch("/api/courses", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Course[] }>("courses")?.data ?? [];
  seedList("courses", [data.data, ...current]);
  return data as { data: Course };
}
export async function updateCourseApi(id: string, payload: any) {
  const data = await apiFetch(`/api/courses/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Course[] }>("courses")?.data ?? [];
  seedList("courses", current.map((x) => (x.id === id ? data.data : x)));
  return data as { data: Course };
}
export async function deleteCourseApi(id: string) {
  const res = await apiFetch(`/api/courses/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Course[] }>("courses")?.data ?? [];
  seedList("courses", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* Experiences                                                                */
/* -------------------------------------------------------------------------- */

export type Experience = { id: string; userId: string; position: string; category?: string | null; organization?: string | null; location?: string | null; startDate?: string | null; endDate?: string | null; current?: boolean; description?: string | null; skills?: string[] | null; visibility?: string; createdAt?: string };
export async function listExperiencesApi() {
  return cachedGet<{ data: Experience[] }>("experiences", "/api/experiences");
}
export async function createExperienceApi(payload: any) {
  const data = await apiFetch("/api/experiences", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Experience[] }>("experiences")?.data ?? [];
  seedList("experiences", [data.data, ...current]);
  return data as { data: Experience };
}
export async function updateExperienceApi(id: string, payload: any) {
  const data = await apiFetch(`/api/experiences/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Experience[] }>("experiences")?.data ?? [];
  seedList("experiences", current.map((x) => (x.id === id ? data.data : x)));
  return data as { data: Experience };
}
export async function deleteExperienceApi(id: string) {
  const res = await apiFetch(`/api/experiences/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Experience[] }>("experiences")?.data ?? [];
  seedList("experiences", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* Achievements                                                               */
/* -------------------------------------------------------------------------- */

export type Achievement = { id: string; userId: string; title: string; category?: string | null; organization?: string | null; date?: string | null; description?: string | null; images?: string[] | null; visibility?: string; createdAt?: string };
export async function listAchievementsApi() {
  return cachedGet<{ data: Achievement[] }>("achievements", "/api/achievements");
}
export async function createAchievementApi(payload: any) {
  const data = await apiFetch("/api/achievements", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Achievement[] }>("achievements")?.data ?? [];
  seedList("achievements", [data.data, ...current]);
  return data as { data: Achievement };
}
export async function updateAchievementApi(id: string, payload: any) {
  const data = await apiFetch(`/api/achievements/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Achievement[] }>("achievements")?.data ?? [];
  seedList("achievements", current.map((x) => (x.id === id ? data.data : x)));
  return data as { data: Achievement };
}
export async function deleteAchievementApi(id: string) {
  const res = await apiFetch(`/api/achievements/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Achievement[] }>("achievements")?.data ?? [];
  seedList("achievements", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

export type Skill = { id: string; userId: string; name: string; category?: string | null; visibility?: string; createdAt?: string };
export async function listSkillsApi() {
  return cachedGet<{ data: Skill[] }>("skills", "/api/skills");
}
export async function createSkillApi(payload: any) {
  const data = await apiFetch("/api/skills", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Skill[] }>("skills")?.data ?? [];
  seedList("skills", [data.data, ...current]);
  return data as { data: Skill };
}
export async function deleteSkillApi(id: string) {
  const res = await apiFetch(`/api/skills/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Skill[] }>("skills")?.data ?? [];
  seedList("skills", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                  */
/* -------------------------------------------------------------------------- */

export type Document = { id: string; userId: string; filename: string; originalName?: string | null; mimeType?: string | null; fileSize?: number | null; category?: string; createdAt?: string };
export async function listDocumentsApi() {
  return cachedGet<{ data: Document[] }>("documents", "/api/documents");
}
export async function createDocumentApi(payload: any) {
  const data = await apiFetch("/api/documents", { method: "POST", auth: true, body: JSON.stringify(payload) });
  const current = readResource<{ data: Document[] }>("documents")?.data ?? [];
  seedList("documents", [data.data, ...current]);
  return data as { data: Document };
}
export async function deleteDocumentApi(id: string) {
  const res = await apiFetch(`/api/documents/${id}`, { method: "DELETE", auth: true });
  const current = readResource<{ data: Document[] }>("documents")?.data ?? [];
  seedList("documents", current.filter((x) => x.id !== id));
  return res;
}

/* -------------------------------------------------------------------------- */
/* Dashboard summary                                                          */
/* -------------------------------------------------------------------------- */

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
  return cachedGet<DashboardSummary>("dashboard", "/api/dashboard");
}

/* -------------------------------------------------------------------------- */
/* Public portfolio                                                           */
/* -------------------------------------------------------------------------- */

/**
 * `/u/[username]` is rendered on the server and cached there, so the browser
 * no longer needs a client-side loader for it. The type lives next to the
 * server fetcher; this is a type-only import, so none of that code is pulled
 * into the client bundle.
 */
export type { PublicPortfolio } from "./publicPortfolio";

/* -------------------------------------------------------------------------- */
/* warming                                                                    */
/* -------------------------------------------------------------------------- */

const WARMERS: Array<() => Promise<unknown>> = [
  () => getDashboardSummaryApi(),
  () => getProfileApi(),
  () => listProjectsApi(),
  () => listActivitiesApi(),
  () => listCertificatesApi(),
  () => listCoursesApi(),
  () => listExperiencesApi(),
  () => listAchievementsApi(),
  () => listSkillsApi(),
  () => listDocumentsApi(),
];

/**
 * Warm every dashboard resource while the browser is idle so that clicking
 * between pages is a pure memory read. Fire-and-forget.
 */
export function warmAll() {
  onIdle(() => {
    for (const warm of WARMERS) {
      Promise.resolve()
        .then(warm)
        .catch(() => {});
    }
  });
}

/** Backwards-compatible alias used by the auth flow. */
export function prefetchAll() {
  warmAll();
}

export function prefetchDashboard() {
  onIdle(() => {
    Promise.resolve().then(() => getDashboardSummaryApi()).catch(() => {});
    Promise.resolve().then(() => getProfileApi()).catch(() => {});
  });
}
