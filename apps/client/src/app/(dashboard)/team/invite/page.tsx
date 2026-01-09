"use client";

import { useActionState } from "react";
import { createInvite } from "./actions";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/card";
import Link from "next/link";

export default function InvitePage() {
  const [state, formAction] = useActionState(createInvite, null);

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Link
          href="/team"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Team
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
          <CardDescription>
            Send an invite code to add someone to your organization
          </CardDescription>
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
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                  Invite created successfully!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Share this code with your team member:
                </p>
                <code className="block mt-2 p-2 bg-white dark:bg-gray-800 rounded text-center font-mono text-lg">
                  {state.inviteCode}
                </code>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  This code expires in 7 days
                </p>
              </div>
            )}

            {state?.message && !state.success && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {state.message}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
