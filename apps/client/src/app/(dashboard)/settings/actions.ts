"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Link Google account to existing user
export async function linkGoogleAccount(): Promise<void> {
  const supabase = await createClient();

  // Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings?linked=google`,
    },
  });

  if (error) {
    // Redirect back to settings with error
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}
