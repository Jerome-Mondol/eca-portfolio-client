"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <Card className="w-full max-w-[420px] p-6 sm:p-7">
      <h1 className="text-xl font-semibold tracking-tight">Forgot password</h1>
      <p className="text-sm text-[#6b6b76] mt-1">Enter your email and we&apos;ll send a reset link.</p>
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" required className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full">Send reset link</Button>
          <p className="text-center text-sm text-[#6b6b76]"><Link href="/login" className="font-medium text-[#111827] hover:underline">Back to log in</Link></p>
        </form>
      ) : (
        <div className="mt-6 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] p-4">
          <p className="text-sm font-medium text-[#166534]">Check your email</p>
          <p className="text-sm text-[#15803d] mt-1">If an account exists, you&apos;ll receive a reset link shortly.</p>
          <Link href="/login" className="mt-3 inline-flex text-sm font-medium text-[#166534] hover:underline">Back to log in →</Link>
        </div>
      )}
    </Card>
  );
}
