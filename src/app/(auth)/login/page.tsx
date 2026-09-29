"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const token = typeof window !== "undefined" ? localStorage.getItem("proofolio_access") : null;
      if (token) router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      success("Welcome back", "Signed in successfully");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.message ?? "Login failed";
      setError(msg);
      toastError("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px] p-6 sm:p-7">
      <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted mt-1">Log in to continue building your portfolio.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" required className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-muted hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" required className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Log in"}
        </Button>
        <p className="text-center text-sm text-muted">
          Don&apos;t have an account? <Link href="/register" className="font-medium text-foreground hover:underline">Create one</Link>
        </p>
      </form>
    </Card>
  );
}
