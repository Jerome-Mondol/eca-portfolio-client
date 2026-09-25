"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const steps = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>(["Technology"]);
  const [showcase, setShowcase] = useState<string[]>(["Projects", "Certificates"]);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      <header className="h-[56px] border-b border-[#ececef] bg-white flex items-center px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#111827] flex items-center justify-center text-white text-xs font-bold">◈</div>
          <span className="font-semibold text-sm">folio</span>
          <span className="text-xs text-[#8a8a94] ml-2">Step {step} of {steps}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex h-1.5 w-32 rounded-full bg-[#f0f0f2] overflow-hidden">
            <div className="h-full bg-[#111827] transition-all" style={{ width: `${(step / steps) * 100}%` }} />
          </div>
          <span className="text-xs text-[#8a8a94]">{Math.round((step / steps) * 100)}%</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-[520px] p-6 sm:p-8">
          {step === 1 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">What&apos;s your name?</h1>
              <p className="text-sm text-[#6b6b76] mt-1">This is how it will appear on your public portfolio.</p>
              <div className="mt-6">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="e.g. John Doe" className="mt-1.5" />
              </div>
              <div className="mt-6 flex justify-between">
                <span />
                <Button onClick={() => setStep(2)}>Continue →</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Tell us a little about yourself.</h1>
              <p className="text-sm text-[#6b6b76] mt-1">A short bio helps visitors understand your story.</p>
              <div className="mt-6 space-y-4">
                <div>
                  <Label>Bio</Label>
                  <textarea placeholder="Computer Science student passionate about web development and AI." className="mt-1.5 w-full min-h-[88px] rounded-xl border border-[#e8e8ea] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/10" />
                </div>
                <div>
                  <Label>Education</Label>
                  <Input placeholder="e.g. BSc in Computer Science, University of Dhaka" className="mt-1.5" />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue →</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">What are you interested in?</h1>
              <p className="text-sm text-[#6b6b76] mt-1">Select all that apply. This helps tailor insights.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Technology", "Business", "Science", "Design", "Arts", "Leadership", "Research", "Other"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggle(interests, setInterests, cat)}
                    className={cn("px-4 py-2 rounded-full border text-sm font-medium transition", interests.includes(cat) ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea] hover:bg-[#f8f8f9]")}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Continue →</Button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight">What would you like to showcase?</h1>
              <p className="text-sm text-[#6b6b76] mt-1">You can always add more later.</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {["Projects", "Courses", "Certificates", "ECA", "Experience", "Achievements"].map((c) => (
                  <label key={c} className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-3 cursor-pointer transition", showcase.includes(c) ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea] hover:bg-[#f8f8f9]")}>
                    <input type="checkbox" checked={showcase.includes(c)} onChange={() => toggle(showcase, setShowcase, c)} className="h-4 w-4 rounded" />
                    <span className="text-sm font-medium">{c}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={() => setStep(5)}>Continue →</Button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-[#111827] text-white flex items-center justify-center mx-auto text-xl">✦</div>
              <h1 className="mt-4 text-xl font-semibold tracking-tight">Let&apos;s build your portfolio.</h1>
              <p className="text-sm text-[#6b6b76] mt-2 max-w-sm mx-auto">You&apos;re all set. Add one project and one certificate to see a beautiful portfolio instantly.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={() => router.push("/dashboard")}>Go to dashboard →</Button>
              </div>
              <p className="text-xs text-[#8a8a94] mt-4">You can edit everything later in Settings.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
