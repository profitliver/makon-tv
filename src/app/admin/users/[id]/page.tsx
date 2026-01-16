"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Wallet, CreditCard, Shield, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate, formatPrice } from "@/lib/utils";

// Mock user data
const mockUser = {
  id: "2",
  email: "user@test.com",
  display_name: "Тестовый пользователь",
  subscription_tier: null,
  subscription_expires_at: null,
  wallet_balance: 0,
  admin_access: false,
  admin_access_until: null,
  is_admin: false,
  created_at: "2024-01-10T12:00:00",
  watch_history: [
    { id: "1", title: "Оппенгеймер", watched_at: "2024-01-14", progress: 45 },
    { id: "2", title: "Паразиты", watched_at: "2024-01-12", progress: 100 },
  ],
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState(mockUser.display_name || "");
  const [walletBalance, setWalletBalance] = useState(mockUser.wallet_balance);
  const [adminAccess, setAdminAccess] = useState(mockUser.admin_access);
  const [adminAccessUntil, setAdminAccessUntil] = useState(mockUser.admin_access_until || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Изменения сохранены!");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Информация о пользователе</h1>
          <p className="text-muted mt-1">{mockUser.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xl">
                    {mockUser.display_name || mockUser.email.split("@")[0]}
                  </p>
                  <p className="text-muted">{mockUser.email}</p>
                </div>
              </div>

              <Input
                label="Отображаемое имя"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                icon={<User className="w-5 h-5" />}
              />

              <div className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg">
                <Mail className="w-5 h-5 text-muted" />
                <div>
                  <p className="text-muted text-sm">Email</p>
                  <p className="text-white">{mockUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg">
                <Calendar className="w-5 h-5 text-muted" />
                <div>
                  <p className="text-muted text-sm">Дата регистрации</p>
                  <p className="text-white">{formatDate(mockUser.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Подписка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-dark-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted text-sm">Текущий тариф</p>
                    <p className="text-white font-semibold text-lg">
                      {mockUser.subscription_tier 
                        ? (mockUser.subscription_tier === "basic" ? "Базовый" : 
                           mockUser.subscription_tier === "standard" ? "Стандарт" : "Премиум")
                        : "Нет подписки"}
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    mockUser.subscription_tier
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {mockUser.subscription_tier ? "Активна" : "Не активна"}
                  </span>
                </div>
                {mockUser.subscription_expires_at && (
                  <p className="text-muted text-sm mt-2">
                    Действует до: {formatDate(mockUser.subscription_expires_at)}
                  </p>
                )}
              </div>
              <p className="text-muted text-sm mt-4">
                * Подписка изменяется через платёжную систему
              </p>
            </CardContent>
          </Card>

          {/* Watch History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                История просмотров
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockUser.watch_history.length > 0 ? (
                <div className="space-y-3">
                  {mockUser.watch_history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-muted text-sm">{item.watched_at}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-24 h-2 bg-dark-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <p className="text-muted text-xs mt-1">{item.progress}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-8">Нет истории просмотров</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Кошелёк
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-muted text-sm">Текущий баланс</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(walletBalance)} сум
                </p>
              </div>
              <Input
                label="Изменить баланс"
                type="number"
                value={walletBalance}
                onChange={(e) => setWalletBalance(Number(e.target.value))}
              />
            </CardContent>
          </Card>

          {/* Admin Access Card - CRITICAL */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                Админ-доступ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Админ-доступ</p>
                  <p className="text-muted text-sm">
                    Даёт право просмотра всего контента
                  </p>
                </div>
                <button
                  onClick={() => setAdminAccess(!adminAccess)}
                  className={cn(
                    "relative w-14 h-8 rounded-full transition-colors",
                    adminAccess ? "bg-primary" : "bg-dark-100"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform",
                      adminAccess ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>

              {adminAccess && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Админ-доступ до (опционально)
                  </label>
                  <input
                    type="date"
                    value={adminAccessUntil}
                    onChange={(e) => setAdminAccessUntil(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-muted text-xs mt-2">
                    Оставьте пустым для бессрочного доступа
                  </p>
                </div>
              )}

              <div className={cn(
                "p-3 rounded-lg text-sm",
                adminAccess ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
              )}>
                {adminAccess 
                  ? "✓ Пользователь может смотреть весь контент"
                  : "⚠ Пользователь не имеет доступа к контенту"}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleSave}
            loading={isSaving}
          >
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  );
}
