import { Button } from "@acme/ui/components/button";
import { ThemeSwitcher } from "@acme/ui/components/theme-switcher";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
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
            }}
          />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Button variant="destructive">Shared Button Component</Button>
    </div>
  );
}
