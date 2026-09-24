"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { getProfileApi, updateProfileApi } from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    getProfileApi()
      .then(({ profile }) => {
        setHeadline(profile.headline ?? "");
        setBio(profile.bio ?? "");
        setLocation(profile.location ?? "");
        setDegree((profile.education as any)?.degree ?? "");
        setInstitution((profile.education as any)?.institution ?? "");
        setInterests(profile.interests ?? []);
        setGithub((profile.socials as any)?.github ?? "");
        setLinkedin((profile.socials as any)?.linkedin ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfileApi({
        headline: headline || null,
        bio: bio || null,
        location: location || null,
        education: { degree, institution },
        interests,
        socials: { github, linkedin },
      });
      success("Profile saved");
    } catch (e: any) {
      toastError("Save failed", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid lg:grid-cols-[320px_1fr] gap-4">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-[#6b6b76]">Your public profile.</p>
        </div>
        <Button onClick={save} disabled={saving} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Card className="p-5 h-fit">
          <div className="flex flex-col items-center text-center">
            <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.fullName || user?.username || "JD")}`} alt="avatar" className="h-24 w-24 rounded-2xl border border-[#e8e8ea] bg-white" />
            <h3 className="font-semibold mt-3">{user?.fullName ?? "—"}</h3>
            <p className="text-xs text-[#6b6b76]">{user?.username ?? ""} • Public</p>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Visibility</p>
            <div className="rounded-xl border border-[#e8e8ea] p-3 flex items-center justify-between">
              <span className="text-sm font-medium">Public portfolio</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1">Enabled</span>
            </div>
            <p className="text-xs text-[#8a8a94]">folio.com/u/{user?.username ?? "—"}</p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Basic information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full name</Label>
                <Input value={user?.fullName ?? ""} disabled className="mt-1.5 bg-[#f8f8f9]" />
                <p className="text-xs text-[#8a8a94] mt-1">From registration</p>
              </div>
              <div>
                <Label>Username</Label>
                <Input value={user?.username ?? ""} disabled className="mt-1.5 bg-[#f8f8f9]" />
              </div>
              <div>
                <Label>Headline</Label>
                <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Computer Science Student" className="mt-1.5" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Bangladesh" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio for your portfolio" className="mt-1.5" />
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Education</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Degree</Label>
                <Input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="BSc in Computer Science" className="mt-1.5" />
              </div>
              <div>
                <Label>Institution</Label>
                <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="University of Dhaka" className="mt-1.5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Social & interests</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>GitHub</Label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" className="mt-1.5" />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {interests.map((i) => (
                  <Badge key={i} className="cursor-pointer" onClick={() => setInterests(interests.filter((x) => x !== i))}>
                    {i} ✕
                  </Badge>
                ))}
                <button
                  onClick={() => {
                    const v = prompt("Add interest");
                    if (v) setInterests([...interests, v]);
                  }}
                  className="text-xs border border-dashed border-[#d0d0d6] rounded-full px-3 py-1.5 text-[#6b6b76] cursor-pointer hover:bg-[#f8f8f9]"
                >
                  + Add
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
