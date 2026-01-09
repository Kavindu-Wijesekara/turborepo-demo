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
  searchParams: Promise<{ error?: string; redirect?: string }>;
};

export default async function AuthErrorPage({ searchParams }: Props) {
  const params = await searchParams;
  const error = params.error || "An authentication error occurred";
  const redirectTo = params.redirect || "/login";

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-destructive text-2xl">Authentication Error</CardTitle>
        <CardDescription>We couldn&apos;t complete your request</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center">{decodeURIComponent(error)}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href={redirectTo}>
            {redirectTo === "/signup" ? "Go to Sign Up" : "Go to Sign In"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
