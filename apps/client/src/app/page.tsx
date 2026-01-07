
import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Client App (Supabase Auth)</h1>
      <Button>Shared Button Component</Button>
    </div>
  );
}
