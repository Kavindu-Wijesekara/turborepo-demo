import { Button } from "@acme/ui/components/button";
import { ThemeSwitcher } from "@acme/ui/components/theme-switcher";
import { User } from "@supabase/supabase-js";

import { signOut } from "@/app/(auth)/actions";

interface DashboardNavProps {
  user: User;
  userName?: string | null;
}

export function DashboardNav({ user, userName }: DashboardNavProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="flex items-center gap-3">
          <div className="text-right">
            {userName && <p className="text-sm font-medium">{userName}</p>}
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
