
import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <UserButton />
      </header>
      <main className="flex-1 p-6">
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-lg font-medium">Welcome to Admin Panel</h2>
          <p className="text-muted-foreground">Manage your application from here.</p>
        </div>
      </main>
    </div>
  );
}
