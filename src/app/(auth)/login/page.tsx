"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { t, locale, setLocale } = useI18n();
  const { login } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    
    setIsLoading(false);
    
    if (result.error) {
      setError(t("errors.invalidCredentials"));
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col p-6 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setLocale(locale === "ru" ? "uz" : "ru")}
            className="px-3 py-1.5 rounded-lg bg-dark-50 text-white text-sm font-medium hover:bg-dark-100 transition-colors"
          >
            {locale.toUpperCase()} ▼
          </button>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-dark-500 font-bold text-xl">M</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {t("auth.login")}
            </h1>
            <p className="text-muted mb-8">
              {t("auth.loginSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder={t("auth.enterEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                type="password"
                placeholder={t("auth.enterPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              {error && (
                <p className="text-error text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                {t("auth.continue")}
              </Button>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-muted hover:text-primary transition-colors text-sm"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-500 text-muted">
                  {t("auth.orContinueWith")}
                </span>
              </div>
            </div>

            {/* Phone login - stub */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-dark-50 text-muted cursor-not-allowed"
            >
              <Phone className="w-5 h-5" />
              <span>{t("auth.phoneLoginSoon")}</span>
              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                {t("common.comingSoon")}
              </span>
            </button>

            {/* Google login - stub */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-dark-50 text-muted cursor-not-allowed mt-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{t("auth.googleLogin")}</span>
              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                {t("common.comingSoon")}
              </span>
            </button>

            {/* Register link */}
            <p className="text-center text-muted mt-8">
              {t("auth.noAccount")}{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                {t("auth.register")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image (hidden on mobile) */}
      <div className="hidden lg:block flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://picsum.photos/seed/makon-login/1920/1080')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-500 to-transparent" />
      </div>
    </div>
  );
}
