import { db } from "@acme/db";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/components/card";

import { DeleteButton } from "@/components/delete-button";

import { deletePost } from "./actions";

export default async function PostsPage() {
  const allPosts = await db.query.posts.findMany({
    with: {
      user: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Posts Management</h2>
        <p className="text-muted-foreground">View and manage all posts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts ({allPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Content</th>
                  <th className="px-4 py-3 text-left font-medium">Author</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPosts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">{post.id}</td>
                    <td className="px-4 py-3 font-medium">{post.title}</td>
                    <td className="text-muted-foreground max-w-xs truncate px-4 py-3">
                      {post.content}
                    </td>
                    <td className="px-4 py-3">
                      {post.user?.name || post.user?.email || "Unknown"}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <DeleteButton
                        itemName="Post"
                        onDelete={async () => {
                          "use server";
                          return deletePost(post.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {allPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-muted-foreground py-8 text-center">
                      No posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
