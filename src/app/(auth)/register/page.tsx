"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const { t, locale, setLocale } = useI18n();
  const { register } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError(t("errors.weakPassword"));
      return;
    }

    setIsLoading(true);

    const result = await register(email, password, name);
    
    setIsLoading(false);
    
    if (result.error) {
      if (result.error.includes("already registered")) {
        setError(t("errors.emailExists"));
      } else {
        setError(result.error);
      }
    } else {
      router.push("/");
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
              {t("auth.register")}
            </h1>
            <p className="text-muted mb-8">
              {t("auth.registerSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder={t("auth.enterName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-5 h-5" />}
                required
              />

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
                placeholder={t("auth.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <Input
                type="password"
                placeholder={t("auth.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {t("auth.createAccount")}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-muted mt-8">
              {t("auth.hasAccount")}{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                {t("auth.login")}
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
            backgroundImage: "url('https://picsum.photos/seed/makon-register/1920/1080')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-500 to-transparent" />
      </div>
    </div>
  );
}
