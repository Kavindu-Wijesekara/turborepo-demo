import { db } from "@repo/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
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
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Content</th>
                  <th className="text-left py-3 px-4 font-medium">Author</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">{post.id}</td>
                    <td className="py-3 px-4 font-medium">{post.title}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-muted-foreground">
                      {post.content}
                    </td>
                    <td className="py-3 px-4">
                      {post.user?.name || post.user?.email || "Unknown"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
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
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
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
