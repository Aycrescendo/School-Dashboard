"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileText, Megaphone, LogOut, School } from "lucide-react";

const menuItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/results", label: "My Results", icon: FileText },
  { href: "/student/announcements", label: "Announcements", icon: Megaphone },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-[#800020] text-white flex flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#6b001a]">
          <School className="w-8 h-8" />
          <span className="text-xl font-bold">SchoolMS</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white text-[#800020] font-semibold"
                    : "text-red-100 hover:bg-[#6b001a]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#6b001a]">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-100 hover:bg-[#6b001a] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">Student Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="text-sm text-gray-600">Student</span>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}