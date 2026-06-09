import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-0 pb-16 md:pb-0">
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 pt-4 md:pt-6 w-full max-w-7xl mx-auto">
            <Breadcrumbs />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
