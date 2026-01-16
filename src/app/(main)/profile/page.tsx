"use client";

import React, { useState } from "react";
import { User, Mail, CreditCard, Clock, Settings, LogOut, Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { formatDate, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Language } from "@/types";

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();
  const { user, logout, updateProfile, isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({ display_name: displayName });
    setIsSaving(false);
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  const subscriptionLabel = user.subscription_tier
    ? t(`subscription.${user.subscription_tier}`)
    : t("subscription.noPlan");

  const hasAccess = user.admin_access || (user.subscription_tier && user.subscription_expires_at && new Date(user.subscription_expires_at) > new Date());

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t("profile.title")}
            </h1>
          </div>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t("profile.personalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xl">
                    {user.display_name || user.email.split("@")[0]}
                  </p>
                  <p className="text-muted">{user.email}</p>
                </div>
              </div>

              {/* Editable fields */}
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label={t("auth.name")}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    icon={<User className="w-5 h-5" />}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleSave} loading={isSaving}>
                      {t("common.save")}
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      {t("common.cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg">
                    <Mail className="w-5 h-5 text-muted" />
                    <div>
                      <p className="text-muted text-sm">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg">
                    <User className="w-5 h-5 text-muted" />
                    <div>
                      <p className="text-muted text-sm">{t("auth.name")}</p>
                      <p className="text-white">{user.display_name || "—"}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => setIsEditing(true)}>
                    {t("profile.editProfile")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("profile.subscriptionStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
                <div>
                  <p className="text-muted text-sm mb-1">{t("subscription.currentPlan")}</p>
                  <p className="text-white font-semibold text-lg">{subscriptionLabel}</p>
                  {user.subscription_expires_at && (
                    <p className="text-muted text-sm mt-1">
                      {t("subscription.expiresAt")}: {formatDate(user.subscription_expires_at, locale)}
                    </p>
                  )}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  hasAccess ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  {hasAccess 
                    ? (locale === "uz" ? "Faol" : "Активна") 
                    : (locale === "uz" ? "Faol emas" : "Не активна")}
                </div>
              </div>
              
              {user.admin_access && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-primary font-medium">
                    {locale === "uz" ? "Admin kirish faol" : "Админ-доступ активен"}
                  </p>
                  {user.admin_access_until && (
                    <p className="text-primary/70 text-sm mt-1">
                      {t("subscription.expiresAt")}: {formatDate(user.admin_access_until, locale)}
                    </p>
                  )}
                </div>
              )}

              <Button className="mt-4 w-full" onClick={() => router.push("/subscription")}>
                {t("subscription.choosePlan")}
              </Button>
            </CardContent>
          </Card>

          {/* Language Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t("profile.language")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <button
                  onClick={() => setLocale("ru")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors",
                    locale === "ru"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-dark-50 border-dark-50 text-white hover:border-primary/50"
                  )}
                >
                  {locale === "ru" && <Check className="w-5 h-5" />}
                  Русский
                </button>
                <button
                  onClick={() => setLocale("uz")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors",
                    locale === "uz"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-dark-50 border-dark-50 text-white hover:border-primary/50"
                  )}
                >
                  {locale === "uz" && <Check className="w-5 h-5" />}
                  O'zbek
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            {t("auth.logout")}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
