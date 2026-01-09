import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  console.log("[Auth Callback] Received code:", code ? "present" : "missing");

  if (code) {
    try {
      const supabase = await createClient();
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);

      console.log("[Auth Callback] Exchange result:", {
        hasError: !!error,
        hasUser: !!data?.user,
        errorMessage: error?.message,
      });

      if (error) {
        console.error("[Auth Callback] Exchange error:", error.message);
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(error.message)}`,
        );
      }

      if (data.user) {
        // Check if user exists in DB and has completed profile
        const dbUser = await db.query.users.findFirst({
          where: eq(users.authId, data.user.id),
        });

        console.log("[Auth Callback] DB User:", {
          exists: !!dbUser,
          profileCompleted: dbUser?.profileCompleted,
        });

        // Determine redirect destination
        let redirectTo = "/dashboard";

        if (!dbUser) {
          // New user - create record and redirect to onboarding
          console.log("[Auth Callback] Creating new user in DB");
          await db.insert(users).values({
            authId: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || null,
            profileCompleted: false,
          });
          redirectTo = "/complete-profile";
        } else if (!dbUser.profileCompleted) {
          // Existing user with incomplete profile
          redirectTo = "/complete-profile";
        }

        // Use the next param if provided, otherwise use our determined redirect
        const finalRedirect = next || redirectTo;
        console.log("[Auth Callback] Redirecting to:", finalRedirect);

        return NextResponse.redirect(`${origin}${finalRedirect}`);
      }
    } catch (err) {
      console.error("[Auth Callback] Unexpected error:", err);
      return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
    }
  }

  console.log("[Auth Callback] No code provided, redirecting to login");
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
