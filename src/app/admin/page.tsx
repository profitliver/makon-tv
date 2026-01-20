"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Film, CreditCard, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    content: 0,
    subscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const [usersResult, contentResult, subscriptionsResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("content").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).not("subscription_tier", "is", null),
      ]);
      setStats({
        users: usersResult.count || 0,
        content: contentResult.count || 0,
        subscriptions: subscriptionsResult.count || 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const statCards = [
    { title: "ÐÑÐµÐ³Ð¾ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»ÐµÐ¹", value: loading ? "..." : stats.users.toString(), icon: Users, color: "text-blue-400", bgColor: "bg-blue-400/10" },
    { title: "ÐÑÐµÐ³Ð¾ ÐºÐ¾Ð½ÑÐµÐ½ÑÐ°", value: loading ? "..." : stats.content.toString(), icon: Film, color: "text-purple-400", bgColor: "bg-purple-400/10" },
    { title: "ÐÐºÑÐ¸Ð²Ð½ÑÑ Ð¿Ð¾Ð´Ð¿Ð¸ÑÐ¾Ðº", value: loading ? "..." : stats.subscriptions.toString(), icon: CreditCard, color: "text-green-400", bgColor: "bg-green-400/10" },
  ];

  const quickActions = [
    { label: "ÐÐ¾Ð±Ð°Ð²Ð¸ÑÑ ÑÐ¸Ð»ÑÐ¼", href: "/admin/content/new?type=movie", icon: Film },
    { label: "ÐÐ¾Ð±Ð°Ð²Ð¸ÑÑ ÑÐµÑÐ¸Ð°Ð»", href: "/admin/content/new?type=series", icon: Film },
    { label: "Ð£Ð¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»ÑÐ¼Ð¸", href: "/admin/users", icon: Users },
    { label: "Ð ÐµÐ´Ð°ÐºÑÐ¸ÑÐ¾Ð²Ð°ÑÑ ÑÐ°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ", href: "/admin/schedule", icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">ÐÐ°Ð½ÐµÐ»Ñ ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ñ</h1>
          <p className="text-muted mt-1">ÐÐ±Ð·Ð¾Ñ ÑÑÐ°ÑÐ¸ÑÑÐ¸ÐºÐ¸ Ð¸ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ñ Ð´ÐµÐ¹ÑÑÐ²Ð¸Ð¹</p>
        </div>
        <Link href="/admin/content/new">
          <Button><Plus className="w-4 h-4 mr-2" />ÐÐ¾Ð±Ð°Ð²Ð¸ÑÑ ÐºÐ¾Ð½ÑÐµÐ½Ñ</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-dark-300 border-dark-50/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-300 border-dark-50/20">
          <CardHeader><CardTitle className="text-white">ÐÑÑÑÑÑÐµ Ð´ÐµÐ¹ÑÑÐ²Ð¸Ñ</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-50 hover:bg-dark-100 transition-colors cursor-pointer">
                  <action.icon className="w-5 h-5 text-muted" />
                  <span className="text-white">{action.label}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-dark-300 border-dark-50/20">
          <CardHeader><CardTitle className="text-white">ÐÐ½ÑÐ¾ÑÐ¼Ð°ÑÐ¸Ñ</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted">ÐÐ¾Ð±ÑÐ¾ Ð¿Ð¾Ð¶Ð°Ð»Ð¾Ð²Ð°ÑÑ Ð² Ð¿Ð°Ð½ÐµÐ»Ñ Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑÑÐ°ÑÐ¾ÑÐ° Makon TV.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
