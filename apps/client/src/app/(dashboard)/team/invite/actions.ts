"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@repo/db";
import { users, invites } from "@repo/db/schema";
import { eq } from "drizzle-orm";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

type InviteState = {
  success: boolean;
  message: string;
  inviteCode?: string;
} | null;

export async function createInvite(
  prevState: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const email = formData.get("email") as string;

  if (!email) {
    return { success: false, message: "Email is required" };
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, user.id),
    with: {
      organization: true,
    },
  });

  if (!dbUser?.organization) {
    return { success: false, message: "No organization found" };
  }

  // Check if user is organization owner
  if (dbUser.organization.createdBy !== dbUser.id) {
    return {
      success: false,
      message: "Only organization owners can invite members",
    };
  }

  // Check if email is already in organization
  const existingMember = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingMember?.organizationId === dbUser.organization.id) {
    return {
      success: false,
      message: "This user is already a member of your organization",
    };
  }

  // Generate invite code
  const code = generateInviteCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

  try {
    await db.insert(invites).values({
      organizationId: dbUser.organization.id,
      email,
      code,
      status: "pending",
      expiresAt,
      createdBy: dbUser.id,
    });

    return {
      success: true,
      message: "Invite created successfully",
      inviteCode: code,
    };
  } catch (error) {
    console.error("Failed to create invite:", error);
    return { success: false, message: "Failed to create invite" };
  }
}
