"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { db } from "@repo/db";
import { users, posts } from "@repo/db/schema";
import { eq } from "drizzle-orm";

type PostState = { success: boolean; message: string } | null;

export async function createPost(
  prevState: PostState,
  formData: FormData,
): Promise<PostState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title?.trim()) {
    return { success: false, message: "Title is required" };
  }

  if (!content?.trim()) {
    return { success: false, message: "Content is required" };
  }

  try {
    // Get db user
    const dbUser = await db.query.users.findFirst({
      where: eq(users.authId, user.id),
    });

    if (!dbUser) {
      return { success: false, message: "User not found" };
    }

    // Create post
    await db.insert(posts).values({
      title: title.trim(),
      content: content.trim(),
      userId: dbUser.id,
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Post created successfully" };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, message: "Failed to create post" };
  }
}
