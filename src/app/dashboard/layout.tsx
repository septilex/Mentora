"use client";

import { BookOpen, Calendar, LayoutDashboard, Library, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Library", href: "/library", icon: Library },
    { name: "Analytics", href: "/analytics", icon: Calendar },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-[#111827]">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-20">
        <div className="font-serif text-xl font-semibold tracking-tight">Mentora.</div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#6B7280] hover:bg-[#F9FAFB] rounded-md transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={clsx(
        "w-full md:w-64 border-r border-[#E5E7EB] bg-[#F9FAFB] flex-col z-10",
        isMobileMenuOpen ? "flex fixed inset-y-0 left-0 pt-16 md:pt-0" : "hidden md:flex sticky top-0 h-screen"
      )}>
        <div className="p-6">
          <div className="font-serif text-2xl font-semibold tracking-tight mb-8 hidden md:block">
            Mentora.
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-white border border-[#E5E7EB] text-[#111827] shadow-sm" 
                      : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-md text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-md text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            Log Out
          </Link>
          
          {/* User Profile */}
          <div className="mt-6 flex items-center gap-3 px-3 border-t border-[#E5E7EB] pt-6">
            <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center text-white text-xs font-medium shrink-0">
              P
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-[#111827] truncate">Prajit</p>
              <p className="text-xs text-[#6B7280] truncate">Pro Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={clsx(
        "flex-1 bg-white w-full",
        isMobileMenuOpen ? "hidden md:block" : "block"
      )}>
        {children}
      </main>
    </div>
  );
}
