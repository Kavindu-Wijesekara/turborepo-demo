"use client";

import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";
import Link from "next/link";
import { useActionState } from "react";

import { createInvite } from "./actions";

export default function InvitePage() {
  const [state, formAction] = useActionState(createInvite, null);

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <Link href="/team" className="text-muted-foreground hover:text-foreground text-sm">
          &larr; Back to Team
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
          <CardDescription>Send an invite code to add someone to your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="colleague@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Invite
            </Button>

            {state?.success && state.inviteCode && (
              <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
                  Invite created successfully!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Share this code with your team member:
                </p>
                <code className="mt-2 block rounded bg-white p-2 text-center font-mono text-lg dark:bg-gray-800">
                  {state.inviteCode}
                </code>
                <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                  This code expires in 7 days
                </p>
              </div>
            )}

            {state?.message && !state.success && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
