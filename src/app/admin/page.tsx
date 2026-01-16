"use client";

import React from "react";
import Link from "next/link";
import { Users, Film, CreditCard, TrendingUp, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Всего пользователей",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "Всего контента",
    value: "156",
    change: "+8",
    icon: Film,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    title: "Активных подписок",
    value: "847",
    change: "+23%",
    icon: CreditCard,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    title: "Просмотров сегодня",
    value: "12,543",
    change: "+18%",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const recentActivity = [
  { action: "Добавлен фильм", entity: "Оппенгеймер", admin: "admin@makontv.uz", time: "5 мин назад" },
  { action: "Изменён пользователь", entity: "user@test.com", admin: "admin@makontv.uz", time: "15 мин назад" },
  { action: "Добавлен сезон", entity: "Ток шоу с Азизом", admin: "admin@makontv.uz", time: "1 час назад" },
  { action: "Удалена подборка", entity: "Старые фильмы", admin: "admin@makontv.uz", time: "2 часа назад" },
  { action: "Изменено расписание", entity: "Понедельник", admin: "admin@makontv.uz", time: "3 часа назад" },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Панель управления</h1>
          <p className="text-muted mt-1">Обзор статистики и последних действий</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/content/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить контент
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/content/new" className="block">
              <Button variant="secondary" className="w-full justify-start gap-3">
                <Film className="w-4 h-4" />
                Добавить фильм
              </Button>
            </Link>
            <Link href="/admin/content/new?type=series" className="block">
              <Button variant="secondary" className="w-full justify-start gap-3">
                <Film className="w-4 h-4" />
                Добавить сериал
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button variant="secondary" className="w-full justify-start gap-3">
                <Users className="w-4 h-4" />
                Управление пользователями
              </Button>
            </Link>
            <Link href="/admin/schedule" className="block">
              <Button variant="secondary" className="w-full justify-start gap-3">
                <Eye className="w-4 h-4" />
                Редактировать расписание
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Последние действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-dark-50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-muted text-sm">{activity.entity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted text-sm">{activity.admin}</p>
                    <p className="text-muted text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/audit" className="block mt-4">
              <Button variant="ghost" className="w-full">
                Смотреть весь журнал
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
