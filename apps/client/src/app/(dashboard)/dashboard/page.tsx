import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/card";
import { CreatePostModal } from "@/components/create-post-modal";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user with organization and posts
  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, user.id),
    with: {
      organization: true,
      posts: true,
      userServices: {
        with: {
          service: true,
        },
      },
    },
  });

  if (!dbUser) {
    redirect("/complete-profile");
  }

  const userPosts = dbUser.posts || [];
  const userServices = dbUser.userServices || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, {dbUser.name || "User"}!
          </h2>
          {dbUser.organization && (
            <p className="text-muted-foreground">{dbUser.organization.name}</p>
          )}
        </div>
        <CreatePostModal />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Posts</CardDescription>
            <CardTitle className="text-3xl">{userPosts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Services</CardDescription>
            <CardTitle className="text-3xl">{userServices.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Organization</CardDescription>
            <CardTitle className="text-lg truncate">
              {dbUser.organization?.name || "None"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.slice(0, 6).map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="text-base">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          {userPosts.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No posts yet. Create your first post!
            </div>
          )}
        </div>
      </div>

      {/* Subscribed Services */}
      {userServices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Services</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userServices.map((us) => (
              <Card key={us.id}>
                <CardHeader>
                  <CardTitle className="text-base">{us.service.name}</CardTitle>
                  <CardDescription>{us.service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
