
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@repo/db'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch posts for the user
  // First get DB user id
  const dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.authId, user.id),
      with: {
          posts: true
      }
  })

  // If new user, they might not have a DB record yet until they create a post (lazy sync in action),
  // OR we should sync them on login.
  // If no dbUser, posts is empty.
  const userPosts = dbUser?.posts || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <h1 className="text-xl font-semibold">User Dashboard</h1>
        <div className="flex gap-4">
             <span className="text-sm text-muted-foreground self-center">{user.email}</span>
             <Link href="/dashboard/new">
                <Button>Create Post</Button>
             </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 truncate">{post.content}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
          {userPosts.length === 0 && (
             <div className="col-span-full text-center py-10 text-muted-foreground">
                 No posts yet. Create one!
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
