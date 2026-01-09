import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged-in users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-4xl font-bold tracking-tight">CloudServ</h1>
        <p className="text-lg text-muted-foreground">
          Your complete cloud services platform. Manage your team, services, and
          more.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
