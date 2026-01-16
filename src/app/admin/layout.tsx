"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Users,
  FolderOpen,
  Calendar,
  FileText,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Панель управления" },
  { href: "/admin/content", icon: Film, label: "Контент" },
  { href: "/admin/users", icon: Users, label: "Пользователи" },
  { href: "/admin/collections", icon: FolderOpen, label: "Подборки" },
  { href: "/admin/schedule", icon: Calendar, label: "Расписание" },
  { href: "/admin/audit", icon: FileText, label: "Журнал действий" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_admin)) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user?.is_admin) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-dark-500 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-400 border-r border-dark-50/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dark-50/20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-dark-500 font-bold text-xl">M</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg block">MAKON TV</span>
              <span className="text-muted text-xs">Админ-панель</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-dark-500"
                    : "text-white/80 hover:text-white hover:bg-dark-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-50/20 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-dark-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            На сайт
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
