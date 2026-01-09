import { db, eq } from "@acme/db";
import { users } from "@acme/db/schema";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

type AuthType = "login" | "signup";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const type = (searchParams.get("type") as AuthType) || "login";

  console.log("[Auth Callback] Received:", {
    code: code ? "present" : "missing",
    type,
  });

  if (!code) {
    console.log("[Auth Callback] No code provided, redirecting to login");
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

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
        `${origin}/auth-error?error=${encodeURIComponent(error.message)}`
      );
    }

    if (!data.user) {
      return NextResponse.redirect(`${origin}/auth-error?error=no_user`);
    }

    const userEmail = data.user.email!;

    // Check if user exists in our database by authId
    const dbUser = await db.query.users.findFirst({
      where: eq(users.authId, data.user.id),
    });

    // Also check if a user with this email exists (for account linking scenarios)
    const dbUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    console.log("[Auth Callback] DB lookup:", {
      type,
      dbUserByAuthId: !!dbUser,
      dbUserByEmail: !!dbUserByEmail,
      authIdsMatch: dbUserByEmail?.authId === data.user.id,
    });

    // ===== SIGNUP FLOW =====
    if (type === "signup") {
      // Case 1: User exists by authId - they already signed up before
      if (dbUser) {
        console.log("[Auth Callback] Signup: User already exists by authId, redirecting");
        return NextResponse.redirect(
          `${origin}${dbUser.profileCompleted ? "/dashboard" : "/complete-profile"}`
        );
      }

      // Case 2: User exists by email but different authId (account linking scenario)
      if (dbUserByEmail && dbUserByEmail.authId !== data.user.id) {
        console.log("[Auth Callback] Signup: Email exists with different auth provider");
        return NextResponse.redirect(
          `${origin}/link-account?email=${encodeURIComponent(userEmail)}`
        );
      }

      // Case 3: Truly new user - create DB record
      console.log("[Auth Callback] Signup: Creating new user");
      await db.insert(users).values({
        authId: data.user.id,
        email: userEmail,
        name: data.user.user_metadata?.full_name || null,
        profileCompleted: false,
      });

      return NextResponse.redirect(`${origin}/complete-profile`);
    }

    // ===== LOGIN FLOW =====
    if (type === "login") {
      // Case 1: User exists by authId - normal login
      if (dbUser) {
        console.log("[Auth Callback] Login: User found, proceeding");
        const redirectTo = next || (dbUser.profileCompleted ? "/dashboard" : "/complete-profile");
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }

      // Case 2: User exists by email but different authId (Google login but email-registered account)
      if (dbUserByEmail && dbUserByEmail.authId !== data.user.id) {
        console.log(
          "[Auth Callback] Login: Account exists with different provider, prompt to link"
        );
        return NextResponse.redirect(
          `${origin}/link-account?email=${encodeURIComponent(userEmail)}&mode=signin`
        );
      }

      // Case 3: No user found - should have signed up first
      console.log("[Auth Callback] Login: No account found");
      // Sign out the Supabase session since we're rejecting this login
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/auth-error?error=${encodeURIComponent("No account found with this email. Please sign up first.")}&redirect=/signup`
      );
    }

    // Fallback (shouldn't reach here)
    return NextResponse.redirect(`${origin}/login`);
  } catch (err) {
    console.error("[Auth Callback] Unexpected error:", err);
    return NextResponse.redirect(`${origin}/auth-error?error=unexpected_error`);
  }
}
