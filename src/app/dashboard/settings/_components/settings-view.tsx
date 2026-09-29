"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export function SettingsView() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-[720px]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Account and security.</p>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-sm">Account</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Email</Label><Input value={user?.email ?? ""} placeholder="john@example.com" readOnly className="mt-1.5 bg-surface-2" /></div>
          <div><Label>Username</Label><Input value={user?.username ?? ""} placeholder="john-doe" readOnly className="mt-1.5 bg-surface-2" /></div>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-sm">Security</h3>
        <div className="space-y-3">
          <div><Label>Current password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>New password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
            <div><Label>Confirm</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
          </div>
          <Button size="sm">Change password</Button>
          <p className="text-xs text-muted-foreground">We use password hashing, httpOnly refresh tokens, rotation/revocation, rate limiting, and validation.</p>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-sm text-red-600">Danger zone</h3>
        <p className="text-sm text-muted mt-1">Delete your account and all portfolio data.</p>
        <Button variant="ghost" size="sm" className="mt-3 border border-red-200 text-red-600 hover:bg-red-50">Delete account</Button>
      </Card>
    </div>
  );
}
