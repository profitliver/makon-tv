"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import type { Language } from "@/types";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/browse", label: t("nav.catalog") },
    { href: "/schedule", label: t("nav.schedule") },
    { href: "/subscription", label: t("nav.subscription") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleLanguage = () => {
    setLocale(locale === "ru" ? "uz" : "ru");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-dark-500/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-dark-500/80 to-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-dark-500 font-bold text-xl">M</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              MAKON TV
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Link
              href="/browse"
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Language switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-dark-50 text-white text-sm font-medium hover:bg-dark-100 transition-colors"
            >
              {locale.toUpperCase()}
            </button>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/60 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-dark-300 border border-dark-50/20 shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-dark-50/20">
                        <p className="text-white font-medium truncate">
                          {user.display_name || user.email}
                        </p>
                        <p className="text-muted text-sm truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {t("nav.profile")}
                        </Link>
                        <Link
                          href="/wallet"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          {t("nav.wallet")}
                        </Link>
                        {user.is_admin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            {t("nav.admin")}
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("auth.logout")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">{t("auth.login")}</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-white md:hidden hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-500/95 backdrop-blur-md border-t border-dark-50/20">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
