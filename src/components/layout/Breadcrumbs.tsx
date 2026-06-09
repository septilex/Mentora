"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip on dashboard as it's the root of the app
  if (pathname === "/dashboard") return null;

  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center text-sm font-medium text-[#6B7280] mb-6 md:mb-8 bg-[#F9FAFB] px-4 py-2.5 rounded-lg border border-[#E5E7EB] w-fit">
      <Link href="/dashboard" className="hover:text-[#111827] transition-colors flex items-center gap-1.5">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {paths.map((path, index) => {
        // Skip 'dashboard' if it somehow ends up in the path array depending on routing
        if (path === "dashboard") return null;
        
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        
        // Basic formatting for path segment
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-[#D1D5DB]" />
            {isLast ? (
              <span className="text-[#111827] truncate max-w-[150px] sm:max-w-none">{formattedPath}</span>
            ) : (
              <Link href={href} className="hover:text-[#111827] transition-colors truncate max-w-[100px] sm:max-w-none">
                {formattedPath}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
