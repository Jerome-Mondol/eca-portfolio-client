import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen page-warm flex flex-col">
      <header className="h-[56px] border-b border-border bg-card flex items-center px-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary-strong flex items-center justify-center text-white text-xs font-bold">◈</div>
          <span className="font-semibold text-sm">folio</span>
        </Link>
        <Link href="/" className="ml-auto text-sm text-muted hover:text-foreground">← Back to home</Link>
      </header>
      <div className="flex-1 grid lg:grid-cols-[1.1fr_0.9fr] max-w-[1100px] mx-auto w-full">
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-10">{children}</div>
        <div className="hidden lg:flex bg-primary-strong text-white relative overflow-hidden flex-col justify-between p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
          <div className="relative">
            <p className="text-sm font-medium text-white/60">What students say</p>
            <blockquote className="mt-6 text-xl leading-8 font-medium">
              &ldquo;Folio turned my scattered certificates and projects into a portfolio I could actually send to recruiters. The AI saved me hours.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=32" alt="" className="h-9 w-9 rounded-full" />
              <div><p className="text-sm font-medium">Aisha Rahman</p><p className="text-xs text-white/60">CSE, 3rd Year • 1.4k portfolio views</p></div>
            </div>
          </div>
          <div className="relative rounded-2xl bg-card/10 backdrop-blur border border-white/15 p-4">
            <p className="text-sm font-medium">Your achievements deserve more than a folder of PDFs.</p>
            <p className="text-xs text-white/60 mt-1">Build → AI organizes → You approve → Publish.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
