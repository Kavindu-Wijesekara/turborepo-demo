import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

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
        <CardTitle className="text-2xl text-destructive">
          Authentication Error
        </CardTitle>
        <CardDescription>
          We couldn&apos;t complete your request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          {decodeURIComponent(error)}
        </p>
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
