import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { users, invites } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/card";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, user.id),
    with: {
      organization: {
        with: {
          users: true,
          invites: {
            where: eq(invites.status, "pending"),
          },
        },
      },
    },
  });

  if (!dbUser?.organization) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">No Organization</h2>
        <p className="text-muted-foreground">
          You are not part of any organization yet.
        </p>
      </div>
    );
  }

  const isOwner = dbUser.organization.createdBy === dbUser.id;
  const teamMembers = dbUser.organization.users;
  const pendingInvites = dbUser.organization.invites;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">{dbUser.organization.name}</p>
        </div>
        {isOwner && (
          <Link href="/team/invite">
            <Button>Invite Members</Button>
          </Link>
        )}
      </div>

      {/* Team Members */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {member.name || "Unnamed User"}
                </CardTitle>
                {member.id === dbUser.organization!.createdBy && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Owner
                  </span>
                )}
              </div>
              <CardDescription>{member.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Invites */}
      {isOwner && pendingInvites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingInvites.map((invite) => (
              <Card key={invite.id}>
                <CardHeader>
                  <CardTitle className="text-base">{invite.email}</CardTitle>
                  <CardDescription>
                    Code: <span className="font-mono">{invite.code}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
