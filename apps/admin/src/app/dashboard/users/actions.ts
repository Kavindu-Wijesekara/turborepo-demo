"use server";

import { revalidatePath } from "next/cache";
import { db, eq } from "@repo/db";
import { users } from "@repo/db/schema";

export async function deleteUser(userId: number) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, message: "Failed to delete user" };
  }
}
