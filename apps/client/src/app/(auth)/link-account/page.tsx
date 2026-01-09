import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ email?: string; mode?: string }>;
};

export default async function LinkAccountPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email || "";
  const mode = params.mode || "signup";

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Account Found</CardTitle>
        <CardDescription>
          An account already exists with {decodeURIComponent(email)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center text-sm">
          {mode === "signin"
            ? "You're trying to sign in with Google, but this email is registered with a different sign-in method."
            : "This email is already registered with a different sign-in method."}
        </p>
        <p className="text-muted-foreground text-center text-sm">
          To link your Google account, please sign in with your original method first, then connect
          Google from your account settings.
        </p>
        <div className="space-y-2">
          <Button className="w-full" asChild>
            <Link href="/login">Sign in with Email</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-center text-xs">
          After signing in, you can link your Google account from Settings &gt; Connected Accounts.
        </p>
      </CardFooter>
    </Card>
  );
}
