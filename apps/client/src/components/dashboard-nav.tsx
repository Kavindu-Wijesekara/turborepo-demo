import { User } from "@supabase/supabase-js";
import { Button } from "@repo/ui/components/button";
import { signOut } from "@/app/(auth)/actions";
import { ThemeSwitcher } from "@repo/ui/components/theme-switcher";

interface DashboardNavProps {
  user: User;
  userName?: string | null;
}

export function DashboardNav({ user, userName }: DashboardNavProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="flex items-center gap-3">
          <div className="text-right">
            {userName && <p className="text-sm font-medium">{userName}</p>}
            <p className="text-xs text-muted-foreground">{user.email}</p>
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
