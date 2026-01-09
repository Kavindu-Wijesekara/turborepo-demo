"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db, eq, and } from "@repo/db";
import {
  users,
  organizations,
  invites,
  userServices,
  services,
} from "@repo/db/schema";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

type ProfileState = { success: boolean; message: string } | null;

export async function getServices() {
  const allServices = await db.query.services.findMany({
    where: eq(services.isActive, true),
  });
  return allServices;
}

export async function completeProfile(
  prevState: ProfileState,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const orgMode = formData.get("orgMode") as "create" | "join";
  const orgName = formData.get("orgName") as string;
  const inviteCode = formData.get("inviteCode") as string;
  const selectedServices = formData.getAll("services") as string[];

  if (!name || !phone) {
    return { success: false, message: "Name and phone are required" };
  }

  try {
    // Get or create user record
    let dbUser = await db.query.users.findFirst({
      where: eq(users.authId, user.id),
    });

    if (!dbUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          authId: user.id,
          email: user.email!,
          name,
          phone,
          profileCompleted: false,
        })
        .returning();
      dbUser = newUser;
    }

    let organizationId: number | null = null;

    if (orgMode === "create" && orgName) {
      // Create new organization
      const slug = generateSlug(orgName);
      const [org] = await db
        .insert(organizations)
        .values({
          name: orgName,
          slug,
          createdBy: dbUser.id,
        })
        .returning();
      organizationId = org.id;
    } else if (orgMode === "join" && inviteCode) {
      // Find and validate invite
      const invite = await db.query.invites.findFirst({
        where: and(
          eq(invites.code, inviteCode.toUpperCase()),
          eq(invites.status, "pending"),
        ),
      });

      if (!invite) {
        return { success: false, message: "Invalid or expired invite code" };
      }

      if (new Date() > invite.expiresAt) {
        await db
          .update(invites)
          .set({ status: "expired" })
          .where(eq(invites.id, invite.id));
        return { success: false, message: "Invite code has expired" };
      }

      // Accept invite
      await db
        .update(invites)
        .set({ status: "accepted" })
        .where(eq(invites.id, invite.id));

      organizationId = invite.organizationId;
    }

    // Update user with profile data
    await db
      .update(users)
      .set({
        name,
        phone,
        organizationId,
        profileCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, dbUser.id));

    // Add selected services
    if (selectedServices.length > 0) {
      await db.insert(userServices).values(
        selectedServices.map((serviceId) => ({
          userId: dbUser.id,
          serviceId: parseInt(serviceId),
        })),
      );
    }
  } catch (error) {
    console.error("Profile completion error:", error);
    return { success: false, message: "Failed to complete profile" };
  }

  redirect("/dashboard");
}
