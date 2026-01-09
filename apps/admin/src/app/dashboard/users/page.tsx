import { db } from "@repo/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { DeleteButton } from "@/components/delete-button";
import { deleteUser } from "./actions";

export default async function UsersPage() {
  const allUsers = await db.query.users.findMany({
    with: {
      organization: true,
    },
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Users Management</h2>
        <p className="text-muted-foreground">
          View and manage all registered users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({allUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Organization
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Profile</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4">{user.name || "-"}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone || "-"}</td>
                    <td className="py-3 px-4">
                      {user.organization?.name || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.profileCompleted
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {user.profileCompleted ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <DeleteButton
                        itemName="User"
                        onDelete={async () => {
                          "use server";
                          return deleteUser(user.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {allUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No users found
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
