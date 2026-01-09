"use server";

import { db, eq } from "@acme/db";
import { posts } from "@acme/db/schema";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: number) {
  try {
    await db.delete(posts).where(eq(posts.id, postId));
    revalidatePath("/dashboard/posts");
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, message: "Failed to delete post" };
  }
}
