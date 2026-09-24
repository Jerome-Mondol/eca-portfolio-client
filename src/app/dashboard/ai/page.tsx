"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";

export default function AIPage() {
  const [active, setActive] = useState("certificate");
  const [projectInput, setProjectInput] = useState("I made a website for our college club using React. I worked with two friends and made the registration system.");
  const [showSuggestion, setShowSuggestion] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">AI Portfolio Assistant</h1>
        <p className="text-sm text-[#6b6b76]">Portfolio copilot. You approve.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { id: "certificate", label: "Analyze a certificate" },
          { id: "project", label: "Improve a project description" },
          { id: "bio", label: "Organize my portfolio" },
          { id: "insights", label: "Find missing information" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`text-sm rounded-full px-4 py-2 border font-medium transition ${active === t.id ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea] hover:bg-[#f8f8f9]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "certificate" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold text-sm">Certificate AI Workflow</h3>
            <div className="mt-4 rounded-xl border border-dashed border-[#d0d0d6] p-6 text-center bg-[#fcfcfd]">
              <p className="text-sm font-medium">Upload certificate.pdf</p>
              <p className="text-xs text-[#6b6b76] mt-1">PDF, JPG, PNG under 10 MB</p>
              <Button className="mt-3" size="sm" onClick={() => setShowSuggestion(true)}>Simulate AI extraction →</Button>
            </div>
            <div className="mt-4 text-xs text-[#8a8a94] space-y-1">
              <p>Flow: Upload → File validation → OCR → AI processing → Structured result</p>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">AI detected (94% confidence)</h3>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Structured JSON</Badge>
            </div>
            {!showSuggestion ? (
              <p className="text-sm text-[#6b6b76] mt-6 text-center py-8 border border-dashed border-[#e8e8ea] rounded-xl bg-[#f8f8f9]">Upload a certificate to see extracted fields.</p>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-[#f8f8f9] border border-[#e8e8ea] p-4 text-sm space-y-2">
                  <p><span className="text-[#8a8a94]">Course:</span> Full Stack Web Development</p>
                  <p><span className="text-[#8a8a94]">Organization:</span> ABC Academy</p>
                  <p><span className="text-[#8a8a94]">Date:</span> 12 Aug 2026</p>
                  <p><span className="text-[#8a8a94]">Skills:</span> React, Node.js, MongoDB</p>
                  <p><span className="text-[#8a8a94]">Certificate ID:</span> ABC-123456</p>
                </div>
                <div className="grid gap-2">
                  <div><Label>Course name</Label><Input defaultValue="Full Stack Web Development" className="mt-1" /></div>
                  <div><Label>Organization</Label><Input defaultValue="ABC Academy" className="mt-1" /></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Add to Courses</Button><Button size="sm" variant="secondary">Edit</Button><Button size="sm" variant="ghost">Discard</Button>
                </div>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2">Never silently publish AI-extracted info. Student reviews → Accept/Edit/Reject → DB.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {active === "project" && (
        <Card className="p-5">
          <h3 className="font-semibold text-sm">Improve project description</h3>
          <p className="text-xs text-[#6b6b76] mt-1">AI must not invent technologies, metrics, or outcomes you didn&apos;t provide.</p>
          <div className="mt-4 grid lg:grid-cols-2 gap-4">
            <div>
              <Label>Original</Label>
              <Textarea value={projectInput} onChange={(e) => setProjectInput(e.target.value)} className="mt-1.5" />
              <Button className="mt-3" size="sm" onClick={() => setShowSuggestion(true)}>✨ Generate suggestion</Button>
            </div>
            <div>
              <Label>AI suggestion</Label>
              {!showSuggestion ? (
                <div className="mt-1.5 rounded-xl border border-[#e8e8ea] bg-[#f8f8f9] p-4 text-sm text-[#8a8a94] min-h-[88px] flex items-center">Click generate to see suggestion.</div>
              ) : (
                <div className="mt-1.5 rounded-xl border border-[#e8e8ea] bg-white p-4 text-sm leading-5">
                  Developed a responsive registration platform for a university club using React, collaborating with a three-person team to streamline event registration and participant management.
                </div>
              )}
              {showSuggestion && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm">Use suggestion</Button><Button size="sm" variant="secondary">Edit</Button><Button size="sm" variant="ghost">Keep original</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {active === "bio" && (
        <Card className="p-5">
          <h3 className="font-semibold text-sm">AI Portfolio Summary</h3>
          <p className="text-xs text-[#6b6b76] mt-1">Generated from your actual data — clearly marked as AI draft.</p>
          <div className="mt-4 rounded-xl bg-[#f8f8f9] border border-[#e8e8ea] p-4">
            <p className="text-sm leading-6">John is a computer science student with experience building web applications using modern JavaScript technologies. His portfolio includes software projects, technical courses, extracurricular leadership, and competitive programming activities.</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Accept</Button><Button size="sm" variant="secondary">Edit</Button><Button size="sm" variant="ghost">Regenerate</Button>
            </div>
          </div>
        </Card>
      )}

      {active === "insights" && (
        <Card className="p-5">
          <h3 className="font-semibold text-sm">Find missing information</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-amber-600">•</span> You have several technical projects but limited info about leadership/volunteering.</li>
            <li className="flex gap-2"><span className="text-emerald-600">•</span> Suggested next step: Document your role in the university programming club.</li>
          </ul>
        </Card>
      )}
    </div>
  );
}
