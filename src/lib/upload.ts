import { API_URL } from "./api";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("folio_access");
}

/**
 * Universal image upload service
 * Used anywhere: profile avatar, project cover, certificate image, etc.
 * POST /api/upload/image with FormData { image: File }
 * Returns { id, url, key } where url is /api/upload/image/:id (relative)
 * Frontend should prefix with API_URL for display
 */
export async function uploadImage(file: File): Promise<{ id: string; url: string; fullUrl: string; key: string }> {
  const form = new FormData();
  form.append("image", file);

  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    headers,
    body: form,
    credentials: "include",
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = data?.message ?? `Upload failed ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  const d = data.data;
  const fullUrl = d.url?.startsWith("http") ? d.url : `${API_URL}${d.url}`;
  return { id: d.id, url: d.url, fullUrl, key: d.key };
}

export function getImageUrl(urlOrKey: string): string {
  if (!urlOrKey) return "";
  if (urlOrKey.startsWith("http")) return urlOrKey;
  if (urlOrKey.startsWith("/api/upload")) return `${API_URL}${urlOrKey}`;
  if (urlOrKey.startsWith("data:")) return urlOrKey;
  // fallback dicebear
  return urlOrKey;
}
