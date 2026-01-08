import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@repo/ui/components/button";
import { ThemeSwitcher } from "@repo/ui/components/theme-switcher";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <ThemeSwitcher />
      <h1 className="text-2xl font-bold">Admin App (Clerk Auth)</h1>
      <header className="flex gap-4">
        <SignedOut>
          <SignInButton
            mode="modal"
            appearance={{
              elements: {
                footer: "hidden",
              },
            }} />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Button variant="destructive">Shared Button Component</Button>
    </div>
  );
}
