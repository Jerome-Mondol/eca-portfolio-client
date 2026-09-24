import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockUser, mockProjects, mockExperiences, mockECA, mockCertificates, mockAchievements, mockSkills } from "@/lib/mockData";
import { Code2, Link2, Mail, MapPin, GraduationCap } from "lucide-react";

export default function PublicPortfolioPage() {
  return (
    <div className="min-h-screen bg-[#fdfdfc] overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#ececef] supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto max-w-[1080px] px-3 sm:px-6 h-[56px] flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <div className="h-7 w-7 rounded-lg bg-[#111827] flex items-center justify-center text-white text-xs font-bold shrink-0">◈</div>
            <span className="font-semibold text-sm">folio</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs text-[#6b6b76] truncate">folio.com/u/{mockUser.username}</span>
            <a href="#contact">
              <Button size="sm" className="min-h-[40px]">Contact</Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO — stacked + centered on mobile per spec §26 */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start">
          <div className="text-center lg:text-left min-w-0">
            <div className="flex justify-center lg:justify-start">
              <img src={mockUser.avatar} alt={mockUser.name} className="h-24 w-24 sm:h-28 sm:w-28 rounded-[24px] border border-[#e8e8ea] shadow-sm object-cover" width={112} height={112} />
            </div>
            <h1 className="mt-4 text-[26px] sm:text-[32px] font-semibold tracking-tight break-words">{mockUser.name}</h1>
            <p className="text-sm text-[#6b6b76]">Computer Science Student</p>
            <p className="text-sm mt-1 break-words" style={{ color: "#111827" }}>{mockUser.headline}</p>
            <p className="mt-4 text-sm leading-6 text-[#4a4a52] max-w-[560px] mx-auto lg:mx-0">John is a computer science student with experience building web applications using modern JavaScript technologies. His portfolio includes software projects, technical courses, extracurricular leadership, and competitive programming activities.</p>
            <div className="mt-5 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-2">
              <Button size="md" className="w-full sm:w-auto min-h-[44px]">View Projects</Button>
              <Button variant="secondary" size="md" className="w-full sm:w-auto min-h-[44px]">Contact Me</Button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2 text-xs">
              <a href="#" className="inline-flex items-center justify-center gap-1.5 border border-[#e8e8ea] rounded-full px-3 min-h-[36px] py-1.5 bg-white hover:bg-[#f8f8f9] flex-1 sm:flex-none">
                <Code2 size={14} /> GitHub
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-1.5 border border-[#e8e8ea] rounded-full px-3 min-h-[36px] py-1.5 bg-white hover:bg-[#f8f8f9] flex-1 sm:flex-none">
                <Link2 size={14} /> LinkedIn
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-1.5 border border-[#e8e8ea] rounded-full px-3 min-h-[36px] py-1.5 bg-white hover:bg-[#f8f8f9] flex-1 sm:flex-none">
                <Mail size={14} /> Email
              </a>
            </div>
          </div>
          <Card className="p-4 sm:p-5 min-w-0">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-sm text-[#4a4a52] mt-2 leading-6 break-words">Based in <span className="font-medium text-[#111827]">Dhaka, Bangladesh</span>. Pursuing <span className="font-medium">BSc in Computer Science, University of Dhaka</span>. Interests: Software Development, AI, Robotics.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {mockUser.interests.map((i) => (<Badge key={i}>{i}</Badge>))}
            </div>
            <div className="mt-4 space-y-2 text-xs text-[#6b6b76]">
              <p className="flex items-center gap-1.5"><MapPin size={14} className="shrink-0" /> Dhaka, Bangladesh</p>
              <p className="flex items-center gap-1.5"><GraduationCap size={14} className="shrink-0" /> University of Dhaka • 2022–2026</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Experience Timeline — stacked cards on mobile per spec §28 */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
        <div className="mt-4 relative">
          <div className="hidden lg:block absolute left-[88px] top-2 bottom-2 w-px bg-[#e8e8ea]" />
          <div className="space-y-3 sm:space-y-4">
            {mockExperiences.map((e) => (
              <div key={e.id} className="grid lg:grid-cols-[80px_1fr] gap-3 sm:gap-4">
                <div className="hidden lg:block text-xs text-[#8a8a94] pt-1 text-right pr-4">{e.period.split("—")[0]}</div>
                <Card className="p-4 sm:p-5 flex gap-3 min-w-0">
                  <span className="hidden lg:flex h-2.5 w-2.5 rounded-full bg-[#111827] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm break-words">{e.role}</h3>
                    <p className="text-sm text-[#6b6b76] break-words">{e.org} • {e.location} • {e.period}</p>
                    <p className="text-sm text-[#4a4a52] mt-2 break-words">{e.description}</p>
                    <ul className="mt-2 space-y-1">{e.achievements.map((a) => (<li key={a} className="text-xs text-[#6b6b76]">• {a}</li>))}</ul>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — one per row on mobile per spec §29 */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {mockProjects.map((p) => (
            <Card key={p.id} className="overflow-hidden min-w-0">
              <img src={p.image} alt={p.title} className="h-40 w-full object-cover" width={400} height={160} />
              <div className="p-4">
                <h3 className="font-semibold text-sm break-words">{p.title}</h3>
                <p className="text-sm text-[#6b6b76] mt-1 line-clamp-2 break-words">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{p.tech.map((t) => (<Badge key={t}>{t}</Badge>))}</div>
                <div className="mt-3 flex gap-2 text-xs">
                  <a href="#" className="border border-[#e8e8ea] rounded-full px-3 py-2 min-h-[36px] flex items-center">GitHub</a>
                  <a href="#" className="bg-[#111827] text-white rounded-full px-3 py-2 min-h-[36px] flex items-center">Live Demo</a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ECA */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg font-semibold tracking-tight">ECA & Activities</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {mockECA.map((a) => (
            <Card key={a.id} className="p-4 min-w-0">
              <p className="text-xs uppercase tracking-wide font-semibold text-[#8a8a94]">{a.category}</p>
              <h3 className="font-semibold text-sm mt-1 break-words">{a.name}</h3>
              <p className="text-xs text-[#6b6b76] break-words">{a.org} • {a.period}</p>
              <p className="text-sm text-[#4a4a52] mt-2 break-words">{a.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Courses & Certificates */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg font-semibold tracking-tight">Courses & Certificates</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {mockCertificates.map((c) => (
            <Card key={c.id} className="p-4 min-w-0">
              <p className="text-xs font-semibold tracking-wide text-[#8a8a94]">CERTIFICATE</p>
              <h3 className="font-semibold text-sm mt-2 break-words">{c.name}</h3>
              <p className="text-xs text-[#6b6b76] break-words">{c.org} • {c.date}</p>
              <div className="flex flex-wrap gap-1 mt-2">{c.skills.map((s) => (<Badge key={s}>{s}</Badge>))}</div>
              <a href="#" className="mt-3 inline-flex text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-2 min-h-[36px] items-center">View credential →</a>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg font-semibold tracking-tight">Achievements</h2>
        <Card className="mt-4 p-4">
          <div className="space-y-2">
            {mockAchievements.map((a) => (
              <div key={a.id} className="flex gap-3 py-2 border-b last:border-0 border-[#f0f0f2] min-w-0">
                <span className="text-lg shrink-0">{a.icon}</span>
                <div className="min-w-0"><p className="text-sm font-medium break-words">{a.title}</p><p className="text-xs text-[#6b6b76] break-words">{a.org} • {a.detail}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg font-semibold tracking-tight">Skills</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-4 min-w-0"><h3 className="text-sm font-semibold">Technical</h3><div className="mt-2 flex flex-wrap gap-1.5">{mockSkills.technical.map((s) => (<Badge key={s}>{s}</Badge>))}</div></Card>
          <Card className="p-4 min-w-0"><h3 className="text-sm font-semibold">Tools</h3><div className="mt-2 flex flex-wrap gap-1.5">{mockSkills.tools.map((s) => (<Badge key={s}>{s}</Badge>))}</div></Card>
          <Card className="p-4 min-w-0"><h3 className="text-sm font-semibold">Soft Skills</h3><div className="mt-2 flex flex-wrap gap-1.5">{mockSkills.soft.map((s) => (<Badge key={s}>{s}</Badge>))}</div></Card>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6 sm:py-8">
        <Card className="p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-sm text-[#6b6b76] mt-1">Available for internships and collaboration.</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
            <a href={`mailto:${mockUser.socials.email}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-[44px] break-all">Email — {mockUser.socials.email}</Button>
            </a>
            <div className="flex gap-2 w-full sm:w-auto">
              <a href="#" className="flex-1 sm:flex-none"><Button variant="secondary" className="w-full min-h-[44px]"><Code2 size={14} className="mr-1" /> GitHub</Button></a>
              <a href="#" className="flex-1 sm:flex-none"><Button variant="secondary" className="w-full min-h-[44px]"><Link2 size={14} className="mr-1" /> LinkedIn</Button></a>
            </div>
          </div>
        </Card>
        <p className="text-center text-xs text-[#8a8a94] mt-6 px-2">Built with folio — Everything you&apos;ve done. One portfolio that tells your story. <Link href="/register" className="underline">Create yours</Link></p>
      </section>
    </div>
  );
}
