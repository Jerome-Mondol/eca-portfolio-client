export type PublicPortfolio = {
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
  };
  profile: any;
  projects: any[];
  activities: any[];
  certificates: any[];
  courses: any[];
  experiences: any[];
  achievements: any[];
  skills: any[];
};

/**
 * Same base URL the browser uses. The public portfolio endpoint needs no auth,
 * so the server can call it directly and the result is cached by Next.
 */
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Matches the API's own 60s Redis window for this endpoint. */
const REVALIDATE_SECONDS = 60;

/**
 * Loads a public portfolio during server rendering.
 *
 * This is what makes `/u/[username]` fast: the page used to ship as a client
 * component that mounted, fired an API request, and then swapped three generic
 * grey blocks for the real page. Now the HTML arrives with the content already
 * in it, so there is no request waterfall and no skeleton on first paint.
 */
export async function getPublicPortfolio(username: string): Promise<PublicPortfolio | null> {
  if (!username) return null;

  try {
    const res = await fetch(`${BASE}/api/portfolio/${encodeURIComponent(username)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Portfolio request failed with ${res.status}`);

    return (await res.json()) as PublicPortfolio;
  } catch {
    // A failed lookup should render the not-found state rather than take the
    // whole route down.
    return null;
  }
}
