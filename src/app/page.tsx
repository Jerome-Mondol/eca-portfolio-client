import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects, mockCertificates, mockUser } from "@/lib/mockData";
import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { Sparkles, ArrowUpRight, Check, Upload, Wand2, FileText, Trophy, Briefcase, GraduationCap, Layers, BarChart3, Award, FolderKanban } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen page-warm flex flex-col">
      <SiteHeader />

      {/* HERO — mobile-first at 320px */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,127,80,0.12),_transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(194,65,12,0.07),_transparent_50%)]" />
        <div className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 sm:py-16">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 sm:gap-8 lg:gap-10 items-center">
            <Reveal delay={0} y={32}>
            <div className="min-w-0">
              <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-[650] tracking-[-0.03em] leading-[0.95] text-foreground break-words">
                Your ECA deserves
                <br />
                <span className="text-muted font-[500]">more than a</span> folder
                <br />
                of certificates.
              </h1>
              <p className="mt-3 sm:mt-4 text-[15px] leading-6 text-muted max-w-[480px]">Showcase ECA — debate, robotics, volunteering with projects and proof. AI organizes, you approve.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto min-h-[48px] text-[15px]">
                    Showcase your ECA <ArrowUpRight size={16} className="ml-1.5" />
                  </Button>
                </Link>
                <Link href="/u/john-doe" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto min-h-[48px] text-[15px]">
                    See student example
                  </Button>
                </Link>
              </div>
              {/* <div className="mt-6 flex items-center gap-2.5 text-[11px] sm:text-xs text-muted-foreground flex-wrap">
                <span className="flex -space-x-1.5 shrink-0">
                  <img src="https://i.pravatar.cc/100?img=11" className="h-6 w-6 rounded-full border-2 border-white" alt="" />
                  <img src="https://i.pravatar.cc/100?img=22" className="h-6 w-6 rounded-full border-2 border-white" alt="" />
                  <img src="https://i.pravatar.cc/100?img=33" className="h-6 w-6 rounded-full border-2 border-white" alt="" />
                </span>
                <span className="leading-tight">Used by 2,400+ students • Free for education • No credit card</span>
              </div> */}
            </div>
            </Reveal>

            {/* Hero visual — portfolio mock — no overflow at 320 */}
            <Reveal delay={130} y={44}>
            <div className="relative min-w-0">
              <div className="rounded-[20px] sm:rounded-[24px] border border-border bg-card shadow-[0_8px_32px_rgba(90,60,30,0.10),0_1px_3px_rgba(90,60,30,0.06)] overflow-hidden">
                <div className="h-9 border-b border-border-soft flex items-center gap-1.5 px-3 sm:px-4 min-w-0">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56] shrink-0" /><span className="h-3 w-3 rounded-full bg-[#ffbd2e] shrink-0" /><span className="h-3 w-3 rounded-full bg-[#27c93f] shrink-0" />
                  <span className="ml-2 sm:ml-3 text-[11px] sm:text-xs text-muted-foreground font-mono truncate">folio.com/u/john-doe</span>
                  {/* <span className="ml-auto text-[11px] sm:text-xs bg-surface-2 border border-border rounded-full px-2 py-1 shrink-0 hidden xs:inline-flex sm:inline-flex">Public • 1,248 views</span>
                  <span className="ml-auto text-[11px] bg-surface-2 border border-border rounded-full px-2 py-1 shrink-0 sm:hidden">1,248 views</span> */}
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    <Avatar name={mockUser.fullName || "John Doe"} className="h-14 w-14 rounded-2xl border border-border" />
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-semibold tracking-tight">John Doe</h3>
                      <p className="text-[13px] text-muted">{mockUser.headline}</p>
                      <p className="text-[13px] leading-5 text-muted mt-2 line-clamp-2">{mockUser.bio}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-surface-2 border border-border py-3"><p className="text-lg font-semibold">8</p><p className="text-xs text-muted">Projects</p></div>
                    <div className="rounded-xl bg-surface-2 border border-border py-3"><p className="text-lg font-semibold">12</p><p className="text-xs text-muted">Certificates</p></div>
                    <div className="rounded-xl bg-surface-2 border border-border py-3"><p className="text-lg font-semibold">3</p><p className="text-xs text-muted">Experiences</p></div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {mockProjects.slice(0, 2).map((p) => (
                      <div key={p.id} className="rounded-xl border border-border overflow-hidden">
                        <img src={p.image} alt={p.title} className="h-24 w-full object-cover" />
                        <div className="p-3">
                          <p className="text-sm font-semibold leading-tight">{p.title}</p>
                          <p className="text-xs text-muted line-clamp-1 mt-1">{p.description}</p>
                          <div className="flex gap-1 mt-2 flex-wrap">{p.tech.slice(0, 2).map((t) => (<span key={t} className="text-[11px] bg-surface-2 border border-border rounded-full px-2 py-0.5">{t}</span>))}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — single column at 320, 2 cols from 560 — ECA framed */}
      <section id="how" className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 sm:py-12 lg:py-16 w-full">
        <Reveal delay={0}>
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="text-sm text-muted">From scattered ECA files → presentable academic profile in minutes.</p>
        </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: "01", t: "Create your student profile", d: "Name, institution, education, and a short bio. The foundation for your ECA showcase." },
            { n: "02", t: "Add your ECA & activities", d: "Debate, robotics, volunteering, leadership — plus projects and certificates. Universal + Add." },
            { n: "03", t: "AI structures your evidence", d: "Certificate details extracted, descriptions polished. Every AI result waits for your approval." },
            { n: "04", t: "Share your ECA portfolio", d: "A clean, academic portfolio link for university, scholarship, or internship applications." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={90 + i * 90}>
            <Card className="p-5 h-full">
              <p className="text-xs font-mono text-muted-foreground">{s.n}</p>
              <h3 className="mt-2 text-[15px] font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-5 text-muted">{s.d}</p>
              <div className="mt-4 h-1.5 rounded-full bg-surface-2 overflow-hidden"><div className="h-full bg-primary-strong" style={{ width: s.n === "01" ? "25%" : s.n === "02" ? "50%" : s.n === "03" ? "75%" : "100%" }} /></div>
            </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES — stacked at 320 — ECA first for educational positioning */}
      <section id="features" className="mx-auto max-w-[1120px]  px-3 sm:px-6 py-8 sm:py-12 lg:py-16 w-full">
        <div>
          <Reveal delay={0}>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Built for ECA — properly</h2>
          <p className="text-sm text-muted mt-1">Six modules. ECA leads, evidence follows.</p>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Trophy, title: "ECA & Activities", desc: "Role, org, dates, proof. What admissions actually read.", highlight: true },
              { icon: Sparkles, title: "AI that structures", desc: "Extracts org, date, category. You approve. Nothing auto-publishes.", highlight: false },
              { icon: FolderKanban, title: "Projects", desc: "Proof you build, not just participate.", highlight: false },
              { icon: Award, title: "Certificates", desc: "PDF or image → credential, skills, clean card.", highlight: false },
              { icon: Briefcase, title: "Experience", desc: "Leadership timeline with context.", highlight: false },
              { icon: BarChart3, title: "Insights", desc: "Where you’ve grown, what to try next.", highlight: false },
            ].map((f, i) => (
              <Reveal key={f.title} delay={90 + i * 75}>
              <Card className={`p-5 h-full ${f.highlight ? "border-success-border bg-surface-2" : ""}`}>
                <span className={`h-9 w-9 rounded-xl border flex items-center justify-center cursor-default ${f.highlight ? "bg-success-soft border-success-border" : "bg-surface-2 border-border"}`}><f.icon size={16} /></span>
                <h3 className="mt-3 text-[15px] font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-5 text-muted">{f.desc}</p>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW — stacked cards on mobile per spec §30 — ECA framed */}
      <section id="portfolio" className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 sm:py-12 lg:py-16 w-full">
        <Reveal delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">What it looks like</h2>
            <p className="text-sm text-muted mt-1">ECA leads. Projects support. Empty sections hide.</p>
          </div>
          <Link href="/u/john-doe" className="text-sm font-medium border border-border rounded-full px-4 py-3 sm:py-2 hover:bg-white transition bg-white text-center min-h-[44px] flex items-center justify-center shrink-0">
            Open student example →
          </Link>
        </div>
        </Reveal>
        <Reveal delay={120} y={36}>
        <div className="mt-6 rounded-[20px] sm:rounded-[24px] border border-border bg-white overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="grid lg:grid-cols-[280px_1fr] gap-0">
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-border-soft bg-card">
              <Avatar name={mockUser.fullName || "John Doe"} className="h-16 w-16 rounded-2xl border border-border" />
              <h3 className="mt-3 text-lg font-semibold">John Doe</h3>
              <p className="text-sm text-muted">Computer Science Student</p>
              <p className="text-xs text-muted-foreground mt-1">Dhaka, Bangladesh • BSc CSE</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">Contact</Button>
                <Button variant="secondary" size="sm" className="flex-1">Projects</Button>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Sections</p>
                {["About", "Experience", "Projects", "ECA", "Courses & Certificates", "Achievements", "Skills"].map((s) => (
                  <div key={s} className="text-sm py-1.5 px-3 rounded-xl bg-white border border-border flex items-center gap-2">☰ {s}</div>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Featured Projects</h4>
              <div className="mt-3 grid sm:grid-cols-2 gap-4">
                {mockProjects.slice(0, 2).map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-36 w-full object-cover" />
                    <div className="p-4">
                      <h5 className="font-semibold text-sm">{p.title}</h5>
                      <p className="text-sm text-muted mt-1 line-clamp-2">{p.description}</p>
                      <div className="flex gap-1.5 mt-3 flex-wrap">{p.tech.map((t) => (<span key={t} className="text-xs bg-surface-2 border border-border rounded-full px-2 py-1">{t}</span>))}</div>
                    </div>
                  </div>
                ))}
              </div>
              <h4 className="mt-8 text-sm font-semibold tracking-wide uppercase text-muted-foreground">Certificates</h4>
              <div className="mt-3 grid sm:grid-cols-3 gap-3">
                {mockCertificates.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border p-4 bg-card">
                    <p className="text-xs tracking-wide font-semibold text-muted-foreground">CERTIFICATE</p>
                    <p className="mt-2 text-sm font-semibold leading-tight">{c.name}</p>
                    <p className="text-xs text-muted">{c.org} • {c.date}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">{c.skills.slice(0, 2).map((s) => (<span key={s} className="text-[11px] bg-white border border-border rounded-full px-2 py-0.5">{s}</span>))}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* AI SECTION — single column at 320 */}
      <section id="ai" className="bg-primary text-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),_transparent_60%)]" />
        <div className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 sm:py-12 lg:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Reveal delay={0} y={32}>
            <div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">AI does the busywork.</h2>
              <p className="mt-3 text-sm leading-6 text-foreground/80 max-w-[480px]">Extract, don’t invent. You approve every result.</p>
              <ul className="mt-6 space-y-2 text-sm text-foreground/90">
                <li className="flex gap-2"><Check size={16} className="text-foreground mt-0.5" /> Certificate details</li>
                <li className="flex gap-2"><Check size={16} className="text-foreground mt-0.5" /> Description polish</li>
                <li className="flex gap-2"><Check size={16} className="text-foreground mt-0.5" /> Portfolio intro draft</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Link href="/dashboard/ai"><Button variant="secondary" size="md" className="bg-white text-foreground border-white hover:bg-white/90">Try AI Assistant</Button></Link>
                <Link href="/register">
                  <Button
                    variant="ghost"
                    size="md"
                    className="relative isolate overflow-hidden border border-foreground
                      text-foreground duration-300
                      before:absolute before:inset-0 before:-z-10 before:bg-primary-strong
                      before:translate-y-full before:transition-transform before:duration-300 before:ease-out
                      hover:before:translate-y-0 hover:-translate-y-0.5
                      hover:text-white"
                  >
                    Create portfolio
                  </Button>
                </Link>
              </div>
            </div>
            </Reveal>
            <Reveal delay={140} y={44}>
            <Card className="bg-white text-foreground p-0 overflow-hidden shadow-[0_18px_40px_rgba(120,40,4,0.22),0_2px_6px_rgba(120,40,4,0.14)] border-white/70">
              <div className="px-5 py-4 border-b border-border-soft flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-surface-2 border border-border flex items-center justify-center"><Upload size={14} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Upload certificate.pdf</p>
                  <p className="text-xs text-muted">2.4 MB • Validated • PDF</p>
                </div>
                <Badge className="bg-primary-strong text-white border-primary-strong">AI detected • 94%</Badge>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="rounded-xl bg-surface-2 border border-border p-4">
                  <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Extracted</p>
                  <div className="mt-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Course</p><p className="font-medium break-words">Full Stack Web Development</p></div>
                    <div><p className="text-xs text-muted-foreground">Organization</p><p className="font-medium break-words">ABC Academy</p></div>
                    <div><p className="text-xs text-muted-foreground">Completion Date</p><p className="font-medium">12 Aug 2026</p></div>
                    <div><p className="text-xs text-muted-foreground">Certificate ID</p><p className="font-medium">ABC-123456</p></div>
                  </div>
                  <div className="mt-3"><p className="text-xs text-muted-foreground">Skills</p><div className="flex gap-1.5 mt-1"><span className="text-xs bg-white border border-border rounded-full px-2 py-1">React</span><span className="text-xs bg-white border border-border rounded-full px-2 py-1">Node.js</span><span className="text-xs bg-white border border-border rounded-full px-2 py-1">MongoDB</span></div></div>
                </div>
                <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3 flex gap-2">
                  <span className="text-amber-600 mt-0.5">⚠</span>
                  <p className="text-xs leading-4 text-[#92400e]">We found a certificate. Review and choose: <b>Add to Courses</b>, Edit, or Discard. Nothing is published automatically.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Course name</label>
                    <div className="h-11 rounded-xl border border-border bg-white px-3 flex items-center text-sm">Full Stack Web Development</div>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button size="sm" className="min-h-[44px] flex-1 sm:flex-none">Add to Courses</Button>
                    <Button variant="secondary" size="sm" className="min-h-[44px]">Edit</Button>
                  </div>
                </div>
              </div>
            </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FINAL CTA — stacked buttons at 320 — ECA educational framing */}
      <section className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 sm:py-12 lg:py-16 w-full">
        <Reveal delay={0} y={32}>
        <div className="rounded-[20px] sm:rounded-[24px] border border-border bg-white p-6 sm:p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(17,24,39,0.04),_transparent_70%)]" />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">More than a line on your application.</h2>
            <p className="mt-2 text-sm text-muted max-w-xl mx-auto">Document ECA with evidence. Clean, academic, ready to share.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-h-[48px]">
                  Showcase your ECA
                </Button>
              </Link>
              <Link href="/u/john-doe" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-h-[48px]">
                  See how it looks
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free for students • Mobile-first • ECA-first • Accessible • No lock-in</p>
          </div>
        </div>
        </Reveal>
      </section>

      <footer className="border-t border-border bg-white">
        <Reveal delay={0} y={20}>
        <div className="mx-auto max-w-[1120px] px-3 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary-strong flex items-center justify-center text-white text-xs font-bold">◈</div>
            <span className="font-semibold text-sm">folio</span>
            <span className="text-xs text-muted-foreground">© 2026 Folio — Educational ECA Showcase</span>
          </div>
          <div className="flex gap-4 text-xs text-muted">
            <a href="#" className="hover:text-foreground">For Students</a>
            <a href="#" className="hover:text-foreground">For Educators</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="https://github.com" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
        </Reveal>
      </footer>
    </div>
  );
}
