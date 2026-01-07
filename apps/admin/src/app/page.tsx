
import { Button } from "@repo/ui/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Admin App (Clerk Auth)</h1>
      <header className="flex gap-4">
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
      </header>
      <Button variant="destructive">Shared Button Component</Button>
    </div>
  );
}
