"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Sparkles, LayoutList, Settings, LogOut, ChevronRight, Share2, Activity } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Materials", href: "/materials", icon: Library },
    { name: "Knowledge", href: "/knowledge", icon: Share2 },
    { name: "Ask", href: "/ask", icon: Sparkles },
    { name: "Flashcards", href: "/flashcards", icon: LayoutList },
    { name: "Diagnostics", href: "/diagnostics", icon: Activity },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E5E7EB] bg-[#F9FAFB] min-h-screen sticky top-0">
        <div className="p-6 pb-2">
          <Link href="/dashboard" className="font-serif text-2xl font-semibold tracking-tight text-[#111827]">
            Mentora.
          </Link>
        </div>

        <div className="px-4 py-4 flex-1">
          <p className="px-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                      : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#111827]" : "text-[#9CA3AF]"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#E5E7EB]">
          <nav className="space-y-1">
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              <Settings className={`w-4 h-4 ${pathname === "/settings" ? "text-[#111827]" : "text-[#9CA3AF]"}`} />
              Settings
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-red-50 hover:text-red-700 transition-colors">
              <LogOut className="w-4 h-4 text-[#9CA3AF] group-hover:text-red-500" />
              Sign out
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E5E7EB] z-50 flex items-center justify-around pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-2 min-w-[64px] ${
                isActive ? "text-[#111827]" : "text-[#9CA3AF]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
