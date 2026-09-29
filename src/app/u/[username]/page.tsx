import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPublicPortfolio } from "@/lib/publicPortfolio";
import { PortfolioView } from "./PortfolioView";

type Params = { params: Promise<{ username: string }> };

/**
 * Rendered on the server, so the HTML already contains the portfolio.
 *
 * This route used to be a client component: the browser downloaded the JS,
 * mounted, fired `/api/portfolio/:username`, and only then swapped three
 * unrelated grey rectangles for the real page. Fetching during SSR removes that
 * waterfall entirely — the response is cached by Next for 60s, matching the
 * API's own Redis window.
 */
export default async function PublicPortfolioPage({ params }: Params) {
  const { username } = await params;
  const data = await getPublicPortfolio(username);

  if (!data) {
    return (
      <div className="min-h-screen page-warm flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-semibold">Portfolio not found</h1>
        <p className="text-sm text-muted mt-2">No portfolio for @{username}</p>
        <Link href="/" className="mt-6">
          <Button>Go home</Button>
        </Link>
      </div>
    );
  }

  return <PortfolioView data={data} />;
}
