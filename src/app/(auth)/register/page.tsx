"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toastError("Check passwords", msg);
      return;
    }
    setLoading(true);
    try {
      await register({ fullName, email, username, password, confirmPassword });
      success("Portfolio created", "Welcome — let’s set up your profile");
      router.push("/onboarding");
    } catch (err: any) {
      const msg = err.message ?? "Registration failed";
      setError(msg);
      toastError("Registration failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px] p-6 sm:p-7">
      <h1 className="text-xl font-semibold tracking-tight">Create your portfolio</h1>
      <p className="text-sm text-[#6b6b76] mt-1">Start building a portfolio you can put on your CV — ECA showcase for education.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" required className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" required className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm text-[#8a8a94] whitespace-nowrap">folio.com/u/</span>
            <Input id="username" placeholder="john-doe" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <p className="text-xs text-[#8a8a94] mt-1">Lowercase letters, numbers, hyphen. Public portfolio URL.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" required className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" placeholder="••••••••" required className="mt-1.5" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create my portfolio"}
        </Button>
        <p className="text-center text-sm text-[#6b6b76]">
          Already have an account? <Link href="/login" className="font-medium text-[#111827] hover:underline">Log in</Link>
        </p>
      </form>
      <p className="mt-4 text-xs text-center text-[#8a8a94]">Neon + Upstash • Access 15m + Refresh 7d rotation</p>
    </Card>
  );
}
