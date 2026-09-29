import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { getImageUrl } from "@/lib/upload";
import { formatMonthYear } from "@/lib/date";
import type { PublicPortfolio } from "@/lib/publicPortfolio";
import { EcaCard } from "./EcaCard";
import { CertCard, CourseCard } from "./LearningCards";
import {
  Code2,
  Link2,
  Mail,
  MapPin,
  Globe,
  Bird,
  Users,
  Camera,
  Video,
  Palette,
  FileText,
  ArrowUpRight,
  Award,
  ExternalLink,
} from "lucide-react";

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

function getExperienceDateRange(experience: any) {
  const start = formatMonthYear(experience.startDate);
  const end = experience.current ? "Present" : formatMonthYear(experience.endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end;
}

function socialHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

function parseAchievementDate(value?: string | null): Date | null {
  if (!value?.trim()) return null;
  const raw = value.trim();
  const datePrefix = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|T| )/.exec(raw);
  if (datePrefix) {
    const [, year, month, day] = datePrefix;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day), 12);
    if (parsed.getFullYear() !== Number(year) || parsed.getMonth() !== Number(month) - 1 || parsed.getDate() !== Number(day)) return null;
    return parsed;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function PortfolioView({ data }: { data: PublicPortfolio }) {
  const { user, profile, projects, activities, certificates, courses, experiences, achievements, skills } = data;
  const hasProjects = projects.length > 0;
  const hasActivities = activities.length > 0;
  const hasCertificates = certificates.length > 0;
  const hasCourses = courses.length > 0;
  // A course references a certificate by id only, so resolve the public
  // credential target here to make the "Linked certificate" pill actionable.
  const credentialUrlById = new Map<string, string>();
  for (const cert of certificates as any[]) {
    if (cert?.id && cert.credentialUrl) credentialUrlById.set(cert.id, cert.credentialUrl);
  }
  const hasExperiences = experiences.length > 0;
  const hasAchievements = achievements.length > 0;
  const achievementGroups = (() => {
    const groups = new Map<string, any[]>();
    for (const achievement of achievements) {
      const parsedDate = parseAchievementDate(achievement.date);
      const year = parsedDate && !Number.isNaN(parsedDate.getTime()) ? String(parsedDate.getFullYear()) : "Undated";
      groups.set(year, [...(groups.get(year) ?? []), achievement]);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a === "Undated" ? 1 : b === "Undated" ? -1 : Number(b) - Number(a))
      .map(([year, items]) => ({
        year,
        items: items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
      }));
  })();
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
  const avatarSrc = profile?.avatarKey ? getImageUrl(profile.avatarKey) : null;

  const github = socials.find((s) => s.platform.toLowerCase().includes("github"));
  const linkedin = socials.find((s) => s.platform.toLowerCase().includes("linkedin"));

  return (
    <div className="min-h-screen page-warm overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border supports-[backdrop-filter]:bg-card/75">
        <div className="mx-auto max-w-[1080px] px-3 sm:px-6 h-[56px] flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <div className="h-7 w-7 rounded-lg bg-primary-strong flex items-center justify-center text-white text-xs font-bold shrink-0">◈</div>
            <span className="font-semibold text-sm">proofolio</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs text-muted truncate">proofolio.com/u/{user.username}</span>
            <a href="#contact">
              <Button size="sm" className="min-h-[40px]">Contact</Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <Reveal y={24}>
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start">
          <div className="text-center lg:text-left min-w-0">
            <div className="flex justify-center lg:justify-start">
              <Avatar
                name={user.fullName || user.username}
                src={avatarSrc}
                className="h-36 w-36 sm:h-40 sm:w-40 rounded-full border border-border shadow-md bg-white"
                ratio={0.4}
              />
            </div>
            <h1 className="mt-4 text-[26px] sm:text-[32px] font-semibold tracking-tight break-words">{user.fullName}</h1>
            <p className="text-sm text-foreground font-medium break-words">{profile?.headline ?? "Student"}</p>
            {profile?.location && (
              <p className="text-xs text-muted mt-1 flex items-center justify-center lg:justify-start gap-1">
                <MapPin size={12} /> {profile.location}
              </p>
            )}
            {profile?.bio ? (
              <p className="mt-4 text-sm leading-6 text-muted-strong max-w-[560px] mx-auto lg:mx-0 break-words">{profile.bio}</p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground max-w-[560px] mx-auto lg:mx-0">No bio yet.</p>
            )}
            <div className="mt-5 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-2">
              {hasProjects && (
                <a href="#projects">
                  <Button size="md" className="w-full sm:w-auto min-h-[44px]">
                    View Projects <ArrowUpRight size={14} className="ml-1" />
                  </Button>
                </a>
              )}
              <a href="#contact">
                <Button variant="secondary" size="md" className="w-full sm:w-auto min-h-[44px]">
                  Contact Me
                </Button>
              </a>
            </div>
            {socials.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-1.5">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={socialHref(s.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 bg-white hover:bg-surface-2 text-xs"
                  >
                    {getPlatformIcon(s.platform, 12)} {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Experience */}
      {hasExperiences && (
        <section id="experience" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <Reveal>
            <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
          </Reveal>
          <Reveal delay={90} y={20}>
          <div className="experience-timeline mt-8">
            <div className="experience-timeline__spine" aria-hidden="true" />
            {experiences.map((ex: any, index: number) => (
              <article
                key={ex.id}
                className={`experience-timeline__item ${index % 2 === 0 ? "is-left" : "is-right"}`}
              >
                <span className="experience-timeline__dot" aria-hidden="true" />
                <Card className="experience-timeline__card p-4 sm:p-5">
                  {getExperienceDateRange(ex) && (
                    <p className="text-xs font-medium text-[#ef6b75] mb-2">{getExperienceDateRange(ex)}</p>
                  )}
                  <h3 className="font-semibold text-sm break-words">{ex.position}</h3>
                  <p className="text-sm text-muted break-words">
                    {[ex.organization, ex.location].filter(Boolean).join(" | ") || "-"}
                  </p>
                  {ex.description && <p className="text-sm text-muted-strong mt-2 break-words">{ex.description}</p>}
                  {ex.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ex.skills.map((skill: string) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </article>
            ))}
          </div>
          </Reveal>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section id="projects" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
            <span className="text-xs text-muted-foreground">
              {projects.length} project{projects.length > 1 ? "s" : ""}
            </span>
          </div>
          </Reveal>
          <Reveal delay={90} y={20}>
          <div className={"project-grid project-grid--count-" + Math.min(projects.length, 5) + " mt-5"}>
            {projects.slice(0, 5).map((p: any, index: number) => {
              const projectLinks = p.links?.length
                ? p.links
                : [
                    ...(p.githubUrl ? [{ platform: "GitHub", url: p.githubUrl }] : []),
                    ...(p.liveUrl ? [{ platform: "Live", url: p.liveUrl }] : []),
                  ];
              return (
                <article key={p.id} className="project-grid__card" style={{ animationDelay: index * 90 + "ms" }}>
                  <div className="project-grid__media">
                    {p.coverImage ? (
                      <img src={getImageUrl(p.coverImage)} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <div className="project-grid__placeholder">
                        <FileText size={28} />
                      </div>
                    )}
                  </div>
                  <div className="project-grid__shade" />
                  <div className="project-grid__content">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                        Project 0{index + 1}
                      </span>
                      {p.featured && (
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white break-words">{p.title}</h3>
                    {p.description && (
                      <p className="mt-1.5 max-w-2xl text-sm leading-5 text-white/85 line-clamp-2">{p.description}</p>
                    )}
                    {p.technologies?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 4).map((technology: string) => (
                          <span
                            key={technology}
                            className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[11px] text-white/90"
                          >
                            {technology}
                          </span>
                        ))}
                        {p.technologies.length > 4 && (
                          <span className="self-center text-xs text-white/70">+{p.technologies.length - 4}</span>
                        )}
                      </div>
                    )}
                    {projectLinks.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {projectLinks.map((link: any, linkIndex: number) => (
                          <a
                            key={link.platform + linkIndex}
                            href={socialHref(link.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-white/85"
                          >
                            {getPlatformIcon(link.platform, 12)}
                            {link.platform}
                            <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          </Reveal>
        </section>
      )}

      {/* ECA & Activities */}
      {hasActivities && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <Reveal>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">ECA &amp; Activities</h2>
            <span className="text-xs text-muted-foreground">
              {activities.length} {activities.length === 1 ? "activity" : "activities"}
            </span>
          </div>
          </Reveal>
          <Reveal delay={90} y={20}>
          <div className="eca-grid mt-5">
            {activities.map((a: any, index: number) => (
              <EcaCard key={a.id} activity={a} style={{ animationDelay: `${index * 70}ms` }} />
            ))}
          </div>
          </Reveal>
        </section>
      )}

      {/* Courses & Certificates */}
      {(hasCertificates || hasCourses) && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <Reveal>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">Courses &amp; Certificates</h2>
            <span className="text-xs text-muted-foreground">
              {certificates.length + courses.length}{" "}
              {certificates.length + courses.length === 1 ? "item" : "items"}
            </span>
          </div>
          </Reveal>
          <Reveal delay={90} y={20}>
          <div className="cred-grid mt-5">
            {certificates.map((c: any, index: number) => (
              <CertCard key={c.id} certificate={c} style={{ animationDelay: `${index * 70}ms` }} />
            ))}
            {courses.map((c: any, index: number) => (
              <CourseCard
                key={`course-${c.id}`}
                course={c}
                style={{ animationDelay: `${(certificates.length + index) * 70}ms` }}
                linkedCredentialUrl={credentialUrlById.get(c.certificateId) ?? null}
              />
            ))}
          </div>
          </Reveal>
        </section>
      )}

      {/* Achievements */}
      {hasAchievements && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-8">
          <Reveal>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Recognition</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight">Achievements</h2>
              </div>
              <span className="text-xs text-muted">{achievements.length} {achievements.length === 1 ? "honor" : "honors"}</span>
            </div>
          </Reveal>
          <Reveal delay={90} y={20}>
            <div className="mt-6 space-y-7 sm:space-y-8">
              {achievementGroups.map((group) => (
                <div key={group.year} className="grid gap-3 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6">
                  <div className="sm:pt-1">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted">{group.year === "Undated" ? "Date" : "Year"}</span>
                    <p className="mt-0.5 text-xl font-semibold tracking-tight text-foreground">{group.year}</p>
                  </div>
                  <div className="relative space-y-0 border-l border-border-soft pl-5 sm:pl-6">
                    {group.items.map((a: any, index: number) => {
                      const parsedDate = parseAchievementDate(a.date);
                      const dateLabel = parsedDate && !Number.isNaN(parsedDate.getTime())
                        ? parsedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : null;
                      const image = a.images?.[0];
                      return (
                        <article key={a.id} className={`relative pb-6 ${index === group.items.length - 1 ? "pb-0" : ""}`}>
                          <span className="absolute -left-[29px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-border-soft bg-card text-primary-strong shadow-sm sm:-left-[33px]" aria-hidden="true">
                            <Award size={14} />
                          </span>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <h3 className="text-sm sm:text-base font-semibold leading-snug">{a.title}</h3>
                                {a.category && <Badge className="text-[10px] px-2 py-0.5">{a.category}</Badge>}
                              </div>
                              {(a.organization || dateLabel) && (
                                <p className="mt-1 text-xs text-muted break-words">
                                  {[a.organization, dateLabel].filter(Boolean).join(" / ")}
                                </p>
                              )}
                              {a.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-strong">{a.description}</p>}
                            </div>
                            <div className="relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 text-amber-800 sm:h-20 sm:w-24">
                              <div className="flex flex-col items-center gap-1">
                                <Award size={21} strokeWidth={1.7} />
                                <span className="text-[8px] font-semibold uppercase tracking-[0.16em]">Recognition</span>
                              </div>
                              {image && (
                                <img
                                  src={getImageUrl(image)}
                                  alt={`${a.title} evidence`}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  onError={(event) => { event.currentTarget.style.display = "none"; }}
                                />
                              )}
                            </div>
                          </div>
                          {index < group.items.length - 1 && <div className="mt-5 border-b border-border-soft" />}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
          <Reveal>
            <h2 className="text-lg font-semibold tracking-tight">Skills</h2>
          </Reveal>
          <Reveal delay={90} y={20}>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s: any) => (
              <Badge key={s.id} className="text-sm px-3 py-1.5">
                {s.name} <span className="text-muted-foreground ml-1">{s.category}</span>
              </Badge>
            ))}
          </div>
          </Reveal>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-8">
        <Reveal y={20}>
        <Card className="p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-sm text-muted mt-1">Available for internships and collaboration.</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
            {github && (
              <a href={socialHref(github.url)} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full sm:w-auto min-h-[44px]">
                  <Code2 size={14} className="mr-1" /> GitHub
                </Button>
              </a>
            )}
            {linkedin && (
              <a href={socialHref(linkedin.url)} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full sm:w-auto min-h-[44px]">
                  <Link2 size={14} className="mr-1" /> LinkedIn
                </Button>
              </a>
            )}
            <a href={`mailto:${user.email}`}>
              <Button className="w-full sm:w-auto min-h-[44px]">
                <Mail size={14} className="mr-1" /> {user.email}
              </Button>
            </a>
          </div>
        </Card>
        </Reveal>
        <p className="text-center text-xs text-muted-foreground mt-6 px-2">
          Built with proofolio —{" "}
          <Link href="/register" className="underline">
            Create yours
          </Link>
        </p>
      </section>
    </div>
  );
}
