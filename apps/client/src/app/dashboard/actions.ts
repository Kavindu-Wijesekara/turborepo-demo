'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { db } from '@repo/db'
import { posts, users } from '@repo/db/schema'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // We need to ensure the user exists in our DB users table
  // Ideally, this sync happens on webhook or middleware, but for now we can upsert or check.
  // Or just rely on auth_id if we changed the schema to link users via auth_id.
  // schema: userId (integer) references users.id (serial). users has authId (text).
  // So we typically need to look up the DB user by Auth ID.

  // Let's first finding the DB user.
  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.authId, user.id)
  })

  let userId: number;

  if (!dbUser) {
    // Create user if not exists (lazy sync)
    const [newUser] = await db.insert(users).values({
      authId: user.id,
      email: user.email!,
      name: user.user_metadata.full_name || user.email,
    }).returning();
    userId = newUser.id;
  } else {
    userId = dbUser.id;
  }

  await db.insert(posts).values({
    title,
    content,
    userId: userId,
  })

  redirect('/dashboard')
}
