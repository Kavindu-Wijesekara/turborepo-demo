import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { db, eq } from "@repo/db";
import { users } from "@repo/db/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile data
  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, user.id),
  });

  // Redirect to profile completion if not completed
  if (!dbUser?.profileCompleted) {
    redirect("/complete-profile");
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav user={user} userName={dbUser?.name} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
