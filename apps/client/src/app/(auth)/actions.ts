"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db, eq, users } from "@repo/db";

type AuthState = { success: boolean; message: string } | null;
type AuthType = "login" | "signup";

const getRedirectUrl = (type: AuthType) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl}/callback?type=${type}`;
};

// Check if user exists in our database by email
async function checkUserExistsByEmail(email: string): Promise<boolean> {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return !!existingUser;
}

// Sign Up with Email (Magic Link) - For new users only
export async function signUpWithEmail(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;

  // Pre-check: Reject if user already exists in DB
  const userExists = await checkUserExistsByEmail(email);
  if (userExists) {
    return {
      success: false,
      message:
        "An account with this email already exists. Please sign in instead.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getRedirectUrl("signup"),
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Check your email for the sign-up link!" };
}

// Sign In with Email (Magic Link) - For existing users only
export async function signInWithEmail(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;

  // Pre-check: Reject if user doesn't exist in DB
  const userExists = await checkUserExistsByEmail(email);
  if (!userExists) {
    return {
      success: false,
      message: "No account found with this email. Please sign up first.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getRedirectUrl("login"),
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Check your email for the login link!" };
}

// Sign Up with Google OAuth - For new users
export async function signUpWithGoogle() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getRedirectUrl("signup"),
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

// Sign In with Google OAuth - For existing users
export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getRedirectUrl("login"),
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

// Sign out
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
