"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicPortfolioApi, type PublicPortfolio } from "@/lib/api";
import { getImageUrl } from "@/lib/upload";
import { Code2, Link2, Mail, MapPin, GraduationCap, Globe, Bird, Users, Camera, Video, Palette, FileText, ArrowUpRight, ExternalLink } from "lucide-react";

function getPlatformIcon(platform: string, size = 14) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Code2 size={size} />;
  if (p.includes("linkedin")) return <Link2 size={size} />;
  if (p.includes("twitter") || p.includes("x")) return <Bird size={size} />;
  if (p.includes("facebook")) return <Users size={size} />;
  if (p.includes("instagram")) return <Camera size={size} />;
  if (p.includes("youtube")) return <Video size={size} />;
  if (p.includes("behance") || p.includes("dribbble")) return <Palette size={size} />;
  return <Globe size={size} />;
}

function formatExperienceDate(value?: string | null) {
  if (!value) return null;
  const datePart = value.slice(0, 10);
  const parsed = new Date(`${datePart}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function getExperienceDateRange(experience: any) {
  const start = formatExperienceDate(experience.startDate);
  const end = experience.current ? "Present" : formatExperienceDate(experience.endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end;
}
export default function PublicPortfolioPage() {
  const params = useParams() as { username: string };
  const username = params?.username as string;
  const [data, setData] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!username) return;
    getPublicPortfolioApi(username)
      .then(setData)
      .catch((e: any) => setError(e.message ?? "Failed to load portfolio"))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfdfc] p-6 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fdfdfc] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-semibold">Portfolio not found</h1>
        <p className="text-sm text-[#6b6b76] mt-2">{error ?? `No portfolio for @${username}`}</p>
        <Link href="/" className="mt-6">
          <Button>Go home</Button>
        </Link>
      </div>
    );
  }

  const { user, profile, projects, activities, certificates, courses, experiences, achievements, skills } = data;
  const hasProjects = projects.length > 0;
  const hasActivities = activities.length > 0;
  const hasCertificates = certificates.length > 0;
  const hasCourses = courses.length > 0;
  const hasExperiences = experiences.length > 0;
  const hasAchievements = achievements.length > 0;
  const hasSkills = skills.length > 0;

  const socials: Array<{ platform: string; url: string }> = (() => {
    const raw: any = profile?.socials;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter((s) => s?.platform && s?.url);
    const arr: any[] = [];
    if (raw.github) arr.push({ platform: "GitHub", url: raw.github });
    if (raw.linkedin) arr.push({ platform: "LinkedIn", url: raw.linkedin });
    Object.entries(raw).forEach(([k, v]) => {
      if (k === "github" || k === "linkedin" || !v) return;
      arr.push({ platform: k, url: String(v) });
    });
    return arr;
  })();

  const interests: string[] = profile?.interests ?? [];
  const education: any = profile?.education ?? {};
  const avatarSrc = profile?.avatarKey ? getImageUrl(profile.avatarKey) : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.fullName || user.username)}`;

  return (
    <div className="min-h-screen bg-[#fdfdfc] overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#ececef] supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto max-w-[1080px] px-3 sm:px-6 h-[56px] flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <div className="h-7 w-7 rounded-lg bg-[#111827] flex items-center justify-center text-white text-xs font-bold shrink-0">◈</div>
            <span className="font-semibold text-sm">folio</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs text-[#6b6b76] truncate">folio.com/u/{user.username}</span>
            <a href="#contact">
              <Button size="sm" className="min-h-[40px]">Contact</Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO — real data, polished */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start">
          <div className="text-center lg:text-left min-w-0">
            <div className="flex justify-center lg:justify-start">
              <img src={avatarSrc} alt={user.fullName} className="h-32 w-32 sm:h-36 sm:w-36 rounded-[28px] border border-[#e8e8ea] shadow-md object-cover bg-white" width={144} height={144} />
            </div>
            <h1 className="mt-4 text-[26px] sm:text-[32px] font-semibold tracking-tight break-words">{user.fullName}</h1>
            <p className="text-sm text-[#111827] font-medium break-words">{profile?.headline ?? "Student"}</p>
            {profile?.location && <p className="text-xs text-[#6b6b76] mt-1 flex items-center justify-center lg:justify-start gap-1"><MapPin size={12} /> {profile.location}</p>}
            {profile?.bio ? (
              <p className="mt-4 text-sm leading-6 text-[#4a4a52] max-w-[560px] mx-auto lg:mx-0 break-words">{profile.bio}</p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#8a8a94] max-w-[560px] mx-auto lg:mx-0">No bio yet.</p>
            )}
            <div className="mt-5 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-2">
              {hasProjects && <a href="#projects"><Button size="md" className="w-full sm:w-auto min-h-[44px]">View Projects <ArrowUpRight size={14} className="ml-1" /></Button></a>}
              <a href="#contact"><Button variant="secondary" size="md" className="w-full sm:w-auto min-h-[44px]">Contact Me</Button></a>
            </div>
            {socials.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-1.5">
                {socials.map((s, i) => (
                  <a key={i} href={s.url.startsWith("http") ? s.url : `https://${s.url}`} target="_blank" className="inline-flex items-center gap-1.5 border border-[#e8e8ea] rounded-full px-3 py-1.5 bg-white hover:bg-[#f8f8f9] text-xs cursor-pointer">
                    {getPlatformIcon(s.platform, 12)} {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* <Card className="portfolio-snapshot p-5 sm:p-6 min-w-0 overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b6b76]">Portfolio snapshot</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Work at a glance</h2>
              </div>
              <span className="h-10 w-10 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-[#111827] text-lg" aria-hidden="true">&#10022;</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Projects", count: projects.length },
                { label: "Experience", count: experiences.length },
                { label: "Certificates", count: certificates.length },
                { label: "Skills", count: skills.length },
              ].map((stat) => (
                <div key={stat.label} className="portfolio-snapshot__stat rounded-2xl border border-[#ececef] bg-white/80 p-3">
                  <span className="block text-2xl font-semibold tracking-tight text-[#111827]">{stat.count}</span>
                  <span className="mt-1 block text-xs text-[#6b6b76]">{stat.label}</span></div>
              ))}
            </div>
            {hasSkills && (
              <div className="mt-5">
                <p className="text-xs font-medium text-[#6b6b76] mb-2">Areas I work with</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.slice(0, 5).map((skill: any) => <Badge key={skill.id}>{skill.name}</Badge>)}
                  {skills.length > 5 && <span className="inline-flex items-center rounded-full border border-[#e8e8ea] px-2.5 py-1 text-xs text-[#6b6b76]">+{skills.length - 5}</span>}
                </div>
              </div>
            )}
          </Card> */}
        </div>
      </section>

      {/* Experience */}
      {hasExperiences && (
        <section id="experience" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
          <div className="experience-timeline mt-8">
            <div className="experience-timeline__spine" aria-hidden="true" />
            {experiences.map((ex: any, index: number) => (
              <article key={ex.id} className={`experience-timeline__item ${index % 2 === 0 ? "is-left" : "is-right"}`}>
                <span className="experience-timeline__dot" aria-hidden="true" />
                <Card className="experience-timeline__card p-4 sm:p-5">
                  {getExperienceDateRange(ex) && <p className="text-xs font-medium text-[#ef6b75] mb-2">{getExperienceDateRange(ex)}</p>}
                  <h3 className="font-semibold text-sm break-words">{ex.position}</h3>
                  <p className="text-sm text-[#6b6b76] break-words">{[ex.organization, ex.location].filter(Boolean).join(" | ") || "-"}</p>
                  {ex.description && <p className="text-sm text-[#4a4a52] mt-2 break-words">{ex.description}</p>}
                  {ex.skills?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{ex.skills.map((skill: string) => <Badge key={skill}>{skill}</Badge>)}</div>}
                </Card>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Projects — polished with image, Things used, and prominent links */}
      {hasProjects && (
        <section id="projects" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
            <span className="text-xs text-[#8a8a94]">{projects.length} project{projects.length > 1 ? "s" : ""}</span>
          </div>
          <div className={"project-grid project-grid--count-" + Math.min(projects.length, 5) + " mt-5"}>
            {projects.slice(0, 5).map((p: any, index: number) => {
              const projectLinks = p.links?.length ? p.links : [
                ...(p.githubUrl ? [{ platform: "GitHub", url: p.githubUrl }] : []),
                ...(p.liveUrl ? [{ platform: "Live", url: p.liveUrl }] : []),
              ];
              return (
                <article key={p.id} className="project-grid__card" style={{ animationDelay: index * 90 + "ms" }}>
                  <div className="project-grid__media">
                    {p.coverImage ? <img src={getImageUrl(p.coverImage)} alt="" loading="lazy" /> : <div className="project-grid__placeholder"><FileText size={28} /></div>}
                  </div>
                  <div className="project-grid__shade" />
                  <div className="project-grid__content">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Project 0{index + 1}</span>
                      {p.featured && <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white">Featured</span>}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white break-words">{p.title}</h3>
                    {p.description && <p className="mt-1.5 max-w-2xl text-sm leading-5 text-white/85 line-clamp-2">{p.description}</p>}
                    {p.technologies?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 4).map((technology: string) => <span key={technology} className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[11px] text-white/90">{technology}</span>)}
                        {p.technologies.length > 4 && <span className="self-center text-xs text-white/70">+{p.technologies.length - 4}</span>}
                      </div>
                    )}
                    {projectLinks.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {projectLinks.map((link: any, linkIndex: number) => (
                          <a key={link.platform + linkIndex} href={link.url.startsWith("http") ? link.url : "https://" + link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#111827] transition hover:bg-white/85">
                            {getPlatformIcon(link.platform, 12)}{link.platform}<ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ECA — polished with slider */}
      {hasActivities && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <h2 className="text-lg font-semibold tracking-tight">ECA & Activities</h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {activities.map((a: any) => (
              <Card key={a.id} className="overflow-hidden min-w-0">
                {a.images?.length > 0 && (
                  <div className="p-3 pb-0">
                    <div className="grid grid-cols-3 gap-1.5">
                      {a.images.slice(0, 3).map((img: string, i: number) => (
                        <a key={i} href={getImageUrl(img)} target="_blank" className={`relative overflow-hidden rounded-xl border border-[#e8e8ea] group block ${i === 0 && a.images.length > 1 ? "col-span-2 row-span-2 h-36 sm:h-40" : "h-[68px] sm:h-[76px]"}`}>
                          <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover group-hover:scale-[1.02] transition duration-300" />
                          {i === 2 && a.images.length > 3 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">+{a.images.length - 3}</div>}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide font-semibold text-[#8a8a94]">{a.category ?? "ECA"}</p>
                  <h3 className="font-semibold text-sm mt-1 break-words">{a.activityName}</h3>
                  <p className="text-xs text-[#6b6b76] break-words">{[a.role, a.organization].filter(Boolean).join(" • ")}</p>
                  {a.description && <p className="text-sm text-[#4a4a52] mt-2 break-words leading-5">{a.description}</p>}
                  {a.skills?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{a.skills.map((s: string) => <Badge key={s}>{s}</Badge>)}</div>}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Certificates & Courses — polished with proper image/PDF and linked badge */}
      {(hasCertificates || hasCourses) && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <h2 className="text-lg font-semibold tracking-tight">Courses & Certificates</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {certificates.map((c: any) => (
              <Card key={c.id} className="overflow-hidden min-w-0 flex flex-col group hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
                {c.documentKey ? (
                  c.documentKey.toLowerCase().endsWith(".pdf") ? (
                    <div className="h-40 bg-[#f8f8f9] border-b border-[#e8e8ea] flex flex-col items-center justify-center gap-2 p-3 relative overflow-hidden">
                      <div className="h-10 w-10 rounded-xl bg-white border border-[#e8e8ea] flex items-center justify-center shadow-sm"><FileText size={18} className="text-[#6b6b76]" /></div>
                      <p className="text-xs font-medium truncate max-w-[180px]">{c.name}</p>
                      <p className="text-xs text-[#6b6b76] truncate max-w-full" title={c.documentName || undefined}>{c.documentName || "Certificate PDF"}</p>
                      <a href={getImageUrl(c.documentKey)} target="_blank" className="text-xs bg-[#111827] text-white rounded-full px-3 py-1.5 hover:bg-black cursor-pointer inline-flex items-center gap-1">View PDF <ExternalLink size={10} /></a>
                    </div>
                  ) : (
                    <a href={getImageUrl(c.documentKey)} target="_blank" className="block h-40 w-full overflow-hidden bg-[#f8f8f9] border-b border-[#e8e8ea]">
                      <img src={getImageUrl(c.documentKey)} alt={c.name} className="h-full w-full object-contain bg-white group-hover:scale-[1.02] transition duration-300" />
                    </a>
                  )
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#f8f8f9] to-[#ececef] border-b border-[#e8e8ea] flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-white border border-[#e8e8ea] flex items-center justify-center"><FileText size={18} className="text-[#8a8a94]" /></div>
                    <span className="text-xs text-[#8a8a94]">No file</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs font-semibold tracking-wide text-[#8a8a94]">CERTIFICATE</p>
                  <h3 className="font-semibold text-sm mt-2 break-words leading-tight">{c.name}</h3>
                  <p className="text-xs text-[#6b6b76] break-words mt-1">{c.organization ?? "—"} • {c.issueDate ? new Date(c.issueDate + "T12:00:00").toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "No date"}</p>
                  {c.credentialId && <p className="text-xs text-[#8a8a94] mt-1 font-mono">ID: {c.credentialId}</p>}
                  {c.skills?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{c.skills.map((s: string) => <Badge key={s}>{s}</Badge>)}</div>}
                  <div className="mt-3 flex items-center gap-2">
                    {c.credentialUrl && <a href={c.credentialUrl} target="_blank" className="inline-flex items-center gap-1 text-xs font-medium text-[#111827] hover:underline cursor-pointer">Credential <ExternalLink size={10} /></a>}
                    {c.documentKey && <span className="text-[#e8e8ea]">•</span>}
                    {c.documentKey && <a href={getImageUrl(c.documentKey)} target="_blank" className="inline-flex items-center gap-1 text-xs font-medium text-[#6b6b76] hover:text-[#111827] cursor-pointer">View file <ExternalLink size={10} /></a>}
                  </div>
                </div>
              </Card>
            ))}
            {courses.map((c: any) => (
              <Card key={`course-${c.id}`} className="p-4 min-w-0">
                <h3 className="font-semibold text-sm break-words">{c.name}</h3>
                <p className="text-xs text-[#6b6b76] break-words mt-1">{[c.provider, c.instructor].filter(Boolean).join(" • ") || "—"}</p>
                {c.description && <p className="text-sm text-[#4a4a52] mt-2 break-words leading-5">{c.description}</p>}
                {c.skills?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{c.skills.map((s: string) => <Badge key={s}>{s}</Badge>)}</div>}
                {c.certificateId && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full inline-flex px-2 py-1 mt-2">🔗 Linked certificate</p>}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Achievements — hide if empty */}
      {hasAchievements && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <h2 className="text-lg font-semibold tracking-tight">Achievements</h2>
          <Card className="mt-4 p-4">
            <div className="space-y-2">
              {achievements.map((a: any) => (
                <div key={a.id} className="flex gap-3 py-2 border-b last:border-0 border-[#f0f0f2] min-w-0">
                  <span className="text-lg shrink-0">🏆</span>
                  <div className="min-w-0"><p className="text-sm font-medium break-words">{a.title}</p><p className="text-xs text-[#6b6b76] break-words">{[a.category, a.organization, a.date].filter(Boolean).join(" • ")} • {a.description ?? ""}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Skills — hide if empty */}
      {hasSkills && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <h2 className="text-lg font-semibold tracking-tight">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s: any) => (
              <Badge key={s.id} className="text-sm px-3 py-1.5">{s.name} <span className="text-[#8a8a94] ml-1">{s.category}</span></Badge>
            ))}
          </div>
        </section>
      )}

      {/* Contact — always show, but with real socials if available */}
      <section id="contact" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-8">
        <Card className="p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-sm text-[#6b6b76] mt-1">Available for internships and collaboration.</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
            {socials.find((s) => s.platform.toLowerCase().includes("github")) && (
              <a href={socials.find((s) => s.platform.toLowerCase().includes("github"))!.url.startsWith("http") ? socials.find((s) => s.platform.toLowerCase().includes("github"))!.url : `https://${socials.find((s) => s.platform.toLowerCase().includes("github"))!.url}`} target="_blank">
                <Button variant="secondary" className="w-full sm:w-auto min-h-[44px] cursor-pointer"><Code2 size={14} className="mr-1" /> GitHub</Button>
              </a>
            )}
            {socials.find((s) => s.platform.toLowerCase().includes("linkedin")) && (
              <a href={socials.find((s) => s.platform.toLowerCase().includes("linkedin"))!.url.startsWith("http") ? socials.find((s) => s.platform.toLowerCase().includes("linkedin"))!.url : `https://${socials.find((s) => s.platform.toLowerCase().includes("linkedin"))!.url}`} target="_blank">
                <Button variant="secondary" className="w-full sm:w-auto min-h-[44px] cursor-pointer"><Link2 size={14} className="mr-1" /> LinkedIn</Button>
              </a>
            )}
            <a href={`mailto:${user.email}`}><Button className="w-full sm:w-auto min-h-[44px] cursor-pointer"><Mail size={14} className="mr-1" /> {user.email}</Button></a>
          </div>
        </Card>
        <p className="text-center text-xs text-[#8a8a94] mt-6 px-2">Built with folio — <Link href="/register" className="underline cursor-pointer">Create yours</Link></p>
      </section>
    </div>
  );
}
