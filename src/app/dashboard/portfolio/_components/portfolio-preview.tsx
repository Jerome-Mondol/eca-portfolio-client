import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

type PortfolioPreviewProps = {
  username: string;
  fullName: string;
  theme: string;
  accent: string;
  sections: string[];
};

/** Static mock of the public page, reflecting the chosen order and accent. */
export function PortfolioPreview({ username, fullName, theme, accent, sections }: PortfolioPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-9 border-b border-border-soft flex items-center px-3 sm:px-4 gap-1.5 min-w-0">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56] shrink-0" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shrink-0" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f] shrink-0" />
        <span className="ml-2 text-xs text-muted-foreground truncate">
          proofolio.com/u/{username || "username"} • {theme}
        </span>
        <span className="ml-auto h-2 w-2 rounded-full shrink-0" style={{ background: accent }} />
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar name={fullName || username || "User"} className="h-16 w-16 rounded-2xl border shrink-0" ratio={0.36} />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{fullName || "Your Name"}</h2>
            <p className="text-sm text-muted">Computer Science Student</p>
            <p className="text-xs mt-1" style={{ color: accent }}>
              Developer • Builder • Student Leader
            </p>
            <p className="text-sm text-muted-strong mt-2">
              Welcome to my portfolio! Showcasing software projects, technical courses, ECA and leadership achievements.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Preview order</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sections.slice(0, 6).map((section) => (
              <span key={section} className="text-xs border border-border rounded-full px-2.5 py-1 bg-surface-2">
                {section}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs font-semibold">Projects</p>
            <p className="text-xs text-muted mt-1">AI Study Assistant • Next.js • Featured</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs font-semibold">Experience</p>
            <p className="text-xs text-muted mt-1">Frontend Intern @ ABC Technologies</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button size="sm" style={{ background: accent }}>Contact Me</Button>
          <Button size="sm" variant="secondary">View Projects</Button>
        </div>
      </div>
    </Card>
  );
}
