"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type LoginState = { success: boolean; message: string } | null;

const getRedirectUrl = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl}/callback`;
};

export async function login(prevState: LoginState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getRedirectUrl(),
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Check your email for the login link!" };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getRedirectUrl(),
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
