import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { db, eq } from "@repo/db";
import { users } from "@repo/db/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, user.id),
    with: {
      organization: true,
      userServices: {
        with: {
          service: true,
        },
      },
    },
  });

  if (!dbUser) redirect("/complete-profile");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{dbUser.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{dbUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{dbUser.phone || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-medium">
                {new Date(dbUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dbUser.organization ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{dbUser.organization.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">
                  {dbUser.organization.createdBy === dbUser.id
                    ? "Owner"
                    : "Member"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No organization</p>
          )}
        </CardContent>
      </Card>

      {/* Subscribed Services */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribed Services</CardTitle>
          <CardDescription>Services you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          {dbUser.userServices.length > 0 ? (
            <div className="space-y-2">
              {dbUser.userServices.map((us) => (
                <div
                  key={us.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{us.service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {us.service.description}
                    </p>
                  </div>
                  {us.service.price && (
                    <p className="text-sm font-medium">
                      ${(us.service.price / 100).toFixed(2)}/mo
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No services subscribed</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
