import { Sidebar } from "@/components/Sidebar";
import { BackgroundShader } from "@/components/BackgroundShader";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name || "Guest";

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <BackgroundShader />
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-col lg:pl-64">
        {/* Header */}
        <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border-glass)] px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle could go here for mobile */}
            <h1 className="font-heading text-lg font-bold">Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Profile / Notification placeholder */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--color-accent-purple)] to-[var(--color-accent-cyan)]" />
              <span className="hidden text-sm font-medium sm:inline-block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
