import { UserButton } from "@clerk/nextjs";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ThemeSwitcher } from "@repo/ui/components/theme-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <UserButton />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
