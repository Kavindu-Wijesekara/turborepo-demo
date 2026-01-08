import { Button } from "@repo/ui/components/button";
import { ThemeSwitcher } from "@repo/ui/components/theme-switcher";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <ThemeSwitcher />
      <h1 className="text-2xl font-bold">Client App (Supabase Auth)</h1>
      <Button>Shared Button Component</Button>
    </div>
  );
}
