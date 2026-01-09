import { db, eq } from "@acme/db";
import { users } from "@acme/db/schema";
import { redirect } from "next/navigation";

import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardNav user={user} userName={dbUser?.name} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
