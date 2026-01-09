import { count, db, organizations, posts, services, users } from "@acme/db";
import { Card, CardDescription, CardHeader, CardTitle } from "@acme/ui/components/card";

export default async function DashboardPage() {
  // Fetch counts
  const [usersCount] = await db.select({ count: count() }).from(users);
  const [postsCount] = await db.select({ count: count() }).from(posts);
  const [orgsCount] = await db.select({ count: count() }).from(organizations);
  const [servicesCount] = await db.select({ count: count() }).from(services);

  const stats = [
    {
      label: "Total Users",
      value: usersCount?.count || 0,
      color: "text-blue-600",
    },
    {
      label: "Total Posts",
      value: postsCount?.count || 0,
      color: "text-green-600",
    },
    {
      label: "Organizations",
      value: orgsCount?.count || 0,
      color: "text-purple-600",
    },
    {
      label: "Services",
      value: servicesCount?.count || 0,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="text-muted-foreground">Platform statistics at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className={`text-3xl ${stat.color}`}>{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
