"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, Shield, ShieldOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const mockUsers = [
  {
    id: "1",
    email: "admin@makontv.uz",
    display_name: "Администратор",
    subscription_tier: "premium",
    subscription_expires_at: "2025-01-15",
    wallet_balance: 500000,
    admin_access: true,
    is_admin: true,
    created_at: "2024-01-01",
  },
  {
    id: "2",
    email: "user@test.com",
    display_name: "Тестовый пользователь",
    subscription_tier: null,
    subscription_expires_at: null,
    wallet_balance: 0,
    admin_access: false,
    is_admin: false,
    created_at: "2024-01-10",
  },
  {
    id: "3",
    email: "premium@test.com",
    display_name: "Премиум пользователь",
    subscription_tier: null,
    subscription_expires_at: null,
    wallet_balance: 100000,
    admin_access: true,
    is_admin: false,
    created_at: "2024-01-05",
  },
  {
    id: "4",
    email: "subscriber@example.com",
    display_name: "Подписчик",
    subscription_tier: "standard",
    subscription_expires_at: "2024-06-15",
    wallet_balance: 50000,
    admin_access: false,
    is_admin: false,
    created_at: "2024-01-08",
  },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccess, setFilterAccess] = useState<"all" | "admin" | "subscriber" | "none">("all");

  const filteredUsers = mockUsers.filter((user) => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (!user.email.toLowerCase().includes(search) && 
          !user.display_name?.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    if (filterAccess === "admin" && !user.admin_access) return false;
    if (filterAccess === "subscriber" && !user.subscription_tier) return false;
    if (filterAccess === "none" && (user.admin_access || user.subscription_tier)) return false;
    
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление пользователями</h1>
          <p className="text-muted mt-1">Просмотр и управление аккаунтами</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Поиск по email или имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-dark-50 border border-dark-50 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Access filter */}
            <select
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value as typeof filterAccess)}
              className="h-10 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Все пользователи</option>
              <option value="admin">С админ-доступом</option>
              <option value="subscriber">С подпиской</option>
              <option value="none">Без доступа</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-50/20">
                  <th className="text-left p-4 text-muted text-sm font-medium">Пользователь</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Подписка</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Баланс</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Админ-доступ</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Регистрация</th>
                  <th className="text-right p-4 text-muted text-sm font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-dark-50/20 hover:bg-dark-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.display_name || "—"}</p>
                          <p className="text-muted text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.subscription_tier ? (
                        <div>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                            {user.subscription_tier === "basic" && "Базовый"}
                            {user.subscription_tier === "standard" && "Стандарт"}
                            {user.subscription_tier === "premium" && "Премиум"}
                          </span>
                          {user.subscription_expires_at && (
                            <p className="text-muted text-xs mt-1">
                              до {formatDate(user.subscription_expires_at)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-white">
                      {formatPrice(user.wallet_balance)} сум
                    </td>
                    <td className="p-4">
                      {user.admin_access ? (
                        <span className="flex items-center gap-1 text-primary">
                          <Shield className="w-4 h-4" />
                          Да
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted">
                          <ShieldOff className="w-4 h-4" />
                          Нет
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-muted">{user.created_at}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">Пользователи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
