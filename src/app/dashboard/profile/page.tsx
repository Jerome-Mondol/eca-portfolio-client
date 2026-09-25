"use client";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { getProfileApi, updateProfileApi } from "@/lib/api";
import { uploadImage, getImageUrl } from "@/lib/upload";
import { Select } from "@/components/ui/select";
import { Copy, Check, Upload, ExternalLink, MapPin, GraduationCap, Code2, Link2, Globe, Camera, Video, Palette, FileText, Users, Bird, Plus, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([]);
  const [newPlatform, setNewPlatform] = useState("GitHub");
  const [newUrl, setNewUrl] = useState("");
  const [newCustomPlatform, setNewCustomPlatform] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const portfolioUrl = typeof window !== "undefined" ? `${window.location.origin}/u/${user?.username ?? ""}` : `/u/${user?.username ?? ""}`;
  const portfolioPath = `folio.com/u/${user?.username ?? ""}`;

  const platformOptions = [
    "GitHub",
    "LinkedIn",
    "Twitter",
    "Facebook",
    "Instagram",
    "YouTube",
    "Behance",
    "Dribbble",
    "Medium",
    "Kaggle",
    "ResearchGate",
    "Portfolio",
    "Website",
    "Other",
  ];

  const getPlatformIcon = (platform: string, size = 12) => {
    const p = platform.toLowerCase();
    if (p.includes("github")) return <Code2 size={size} />;
    if (p.includes("linkedin")) return <Link2 size={size} />;
    if (p.includes("twitter") || p.includes("x")) return <Bird size={size} />;
    if (p.includes("facebook")) return <Users size={size} />;
    if (p.includes("instagram")) return <Camera size={size} />;
    if (p.includes("youtube")) return <Video size={size} />;
    if (p.includes("behance") || p.includes("dribbble")) return <Palette size={size} />;
    if (p.includes("medium")) return <FileText size={size} />;
    if (p.includes("kaggle") || p.includes("research")) return <GraduationCap size={size} />;
    return <Globe size={size} />;
  };

  const normalizeSocials = (raw: any): Array<{ platform: string; url: string }> => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.filter((s) => s?.platform && s?.url).map((s) => ({ platform: String(s.platform), url: String(s.url) }));
    }
    // Legacy object { github, linkedin }
    const arr: Array<{ platform: string; url: string }> = [];
    if (raw.github) arr.push({ platform: "GitHub", url: String(raw.github) });
    if (raw.linkedin) arr.push({ platform: "LinkedIn", url: String(raw.linkedin) });
    // Handle any other keys as platform
    Object.entries(raw).forEach(([k, v]) => {
      if (k === "github" || k === "linkedin" || !v) return;
      arr.push({ platform: k.charAt(0).toUpperCase() + k.slice(1), url: String(v) });
    });
    return arr;
  };

  useEffect(() => {
    getProfileApi()
      .then(({ user: u, profile }) => {
        setFullName(u?.fullName ?? user?.fullName ?? "");
        setHeadline(profile.headline ?? "");
        setBio(profile.bio ?? "");
        setLocation(profile.location ?? "");
        setDegree((profile.education as any)?.degree ?? "");
        setInstitution((profile.education as any)?.institution ?? "");
        setInterests(profile.interests ?? []);
        setSocials(normalizeSocials(profile.socials));
        setAvatarKey(profile.avatarKey ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.fullName, user?.username]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      const newKey = res.url;
      setAvatarKey(newKey);
      // Auto-save avatar immediately so it persists without needing Save click
      try {
        await updateProfileApi({ avatarKey: newKey } as any);
        success("Profile image updated");
      } catch (saveErr: any) {
        // Keep preview even if auto-save fails — user can click Save
        success("Image uploaded", "Click Save to apply");
      }
    } catch (err: any) {
      toastError("Upload failed", err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      success("Copied", portfolioPath);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Copy failed");
    }
  };

  const addSocial = () => {
    const platform = newPlatform === "Other" ? newCustomPlatform.trim() : newPlatform;
    const url = newUrl.trim();
    if (!platform || !url) {
      toastError("Add social", "Platform and URL required");
      return;
    }
    // basic URL validation
    if (!url.includes(".")) {
      toastError("Invalid URL", "Include domain, e.g. example.com/you");
      return;
    }
    setSocials([...socials, { platform, url }]);
    setNewUrl("");
    setNewCustomPlatform("");
    success("Social added", `${platform}`);
  };

  const removeSocial = (idx: number) => {
    setSocials(socials.filter((_, i) => i !== idx));
  };

  const save = async () => {
    if (!fullName.trim()) {
      toastError("Full name required");
      return;
    }
    setSaving(true);
    try {
      await updateProfileApi({
        fullName: fullName.trim(),
        headline: headline || null,
        bio: bio || null,
        location: location || null,
        education: { degree, institution },
        interests,
        socials, // array of {platform, url} — works for any platform (tech or not)
        avatarKey: avatarKey || null,
      } as any);
      await refreshUser();
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
          <Skeleton className="h-[360px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  const avatarSrc = avatarKey ? getImageUrl(avatarKey) : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName || user?.username || "JD")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-[#6b6b76]">Your public profile — ECA showcase.</p>
        </div>
        <Button onClick={save} disabled={saving} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        {/* Left card — avatar + portfolio link + live preview of all profile fields */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <img src={avatarSrc} alt="avatar" className="h-24 w-24 rounded-2xl border border-[#e8e8ea] bg-white object-cover" />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition cursor-pointer"
                >
                  {uploading ? "..." : <><Upload size={14} className="mr-1" /> Change</>}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <h3 className="font-semibold mt-3">{fullName || user?.fullName || "—"}</h3>
              {headline ? <p className="text-sm text-[#111827] mt-1 font-medium">{headline}</p> : <p className="text-xs text-[#8a8a94] mt-1">No headline yet</p>}
              <p className="text-xs text-[#6b6b76] mt-1">@{user?.username ?? ""} • Public</p>
              {location && (
                <p className="text-xs text-[#6b6b76] mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {location}
                </p>
              )}
              <Button variant="secondary" size="sm" className="mt-3 w-full cursor-pointer" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload image"}
              </Button>
              <p className="text-[11px] text-[#8a8a94] mt-1">JPEG, PNG, WebP — max 5MB.</p>
            </div>

            {bio && (
              <div className="mt-5">
                <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Bio</p>
                <p className="text-sm text-[#4a4a52] mt-1.5 leading-5 line-clamp-4">{bio}</p>
              </div>
            )}

            {(degree || institution) && (
              <div className="mt-5">
                <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94] flex items-center gap-1">
                  <GraduationCap size={12} /> Education
                </p>
                <div className="mt-1.5 rounded-xl border border-[#e8e8ea] bg-[#f8f8f9] p-3">
                  <p className="text-sm font-medium">{degree || "—"}</p>
                  <p className="text-xs text-[#6b6b76]">{institution || "—"}</p>
                </div>
              </div>
            )}

            {socials.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Social</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {socials.map((s, idx) => (
                    <a
                      key={`${s.platform}-${idx}`}
                      href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer bg-white"
                    >
                      {getPlatformIcon(s.platform, 12)} <span className="truncate max-w-[120px]">{s.platform}</span>
                    </a>
                  ))}
                </div>
                <p className="text-[11px] text-[#8a8a94] mt-1">Logos hyperlinked — for any platform (tech or not).</p>
              </div>
            )}

            {interests.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Interests</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {interests.map((i) => (
                    <Badge key={i} className="text-xs">{i}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Portfolio link</p>
              <div className="rounded-xl border border-[#e8e8ea] bg-[#f8f8f9] p-3 flex items-center gap-2">
                <span className="text-sm font-mono truncate flex-1">{portfolioPath}</span>
                <button onClick={copyLink} className="h-8 w-8 rounded-full bg-white border border-[#e8e8ea] flex items-center justify-center hover:bg-[#f3f3f5] cursor-pointer shrink-0" aria-label="Copy link">
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
                <a href={portfolioUrl} target="_blank" className="h-8 w-8 rounded-full bg-[#111827] text-white flex items-center justify-center hover:bg-black cursor-pointer shrink-0" aria-label="Open portfolio">
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-xs text-[#8a8a94]">Share for applications. Anyone with link can view.</p>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Visibility</p>
              <div className="rounded-xl border border-[#e8e8ea] p-3 flex items-center justify-between">
                <span className="text-sm font-medium">Public portfolio</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1">Enabled</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right — editable fields */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Basic information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full name *</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1.5" />
                <p className="text-xs text-[#8a8a94] mt-1">Editable — updates everywhere.</p>
              </div>
              <div>
                <Label>Username</Label>
                <Input value={user?.username ?? ""} disabled className="mt-1.5 bg-[#f8f8f9]" />
                <p className="text-xs text-[#8a8a94] mt-1">Your portfolio URL</p>
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
            <h3 className="font-semibold text-sm">Social accounts</h3>
            <p className="text-xs text-[#6b6b76] -mt-2">Add any platform — GitHub, LinkedIn, Instagram, YouTube, Behance, portfolio, etc. Everyone is welcome (tech or not).</p>

            {socials.length > 0 && (
              <div className="space-y-2">
                {socials.map((s, idx) => (
                  <div key={`${s.platform}-${idx}`} className="flex items-center gap-2 rounded-xl border border-[#e8e8ea] bg-[#f8f8f9] px-3 py-2">
                    <span className="h-7 w-7 rounded-full bg-white border border-[#e8e8ea] flex items-center justify-center shrink-0">{getPlatformIcon(s.platform, 14)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{s.platform}</p>
                      <p className="text-xs text-[#6b6b76] truncate">{s.url}</p>
                    </div>
                    <button onClick={() => removeSocial(idx)} className="h-7 w-7 rounded-full bg-white border border-[#e8e8ea] flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer shrink-0" aria-label="Remove">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-[160px_1fr] gap-2 items-center">
              <Select
                value={newPlatform}
                onChange={setNewPlatform}
                options={platformOptions.map((p) => ({
                  value: p,
                  label: p,
                  icon: getPlatformIcon(p, 14),
                }))}
              />
              <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="" />
            </div>
            {newPlatform === "Other" && (
              <Input value={newCustomPlatform} onChange={(e) => setNewCustomPlatform(e.target.value)} placeholder="Custom platform name (e.g. ArtStation)" className="" />
            )}
            <Button variant="secondary" size="sm" className="w-full sm:w-auto cursor-pointer" onClick={addSocial}>
              <Plus size={14} className="mr-1" /> Add social
            </Button>

            <div className="pt-2 border-t border-[#f0f0f2]">
              <p className="text-xs font-medium mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
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
