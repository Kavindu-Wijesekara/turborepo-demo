"use server";

import { db, eq } from "@acme/db";
import { users } from "@acme/db/schema";
import { revalidatePath } from "next/cache";

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
