"use server";

import { revalidatePath } from "next/cache";
import { db, eq } from "@repo/db";
import { posts } from "@repo/db/schema";

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
