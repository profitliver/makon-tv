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
                    supabase
                      .from("profiles")
                      .select("id", { count: "exact", head: true })
                      .not("subscription_tier", "is", null),
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
    {
            title: "Vsego polzovateley",
            value: loading ? "..." : stats.users.toString(),
            icon: Users,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
    },
    {
            title: "Vsego kontenta",
            value: loading ? "..." : stats.content.toString(),
            icon: Film,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
    },
    {
            title: "Aktivnyh podpisok",
            value: loading ? "..." : stats.subscriptions.toString(),
            icon: CreditCard,
            color: "text-green-400",
            bgColor: "bg-green-400/10",
    },
      ];

  const quickActions = [
    { label: "Dobavit film", href: "/admin/content/new?type=movie", icon: Film },
    { label: "Dobavit serial", href: "/admin/content/new?type=series", icon: Film },
    { label: "Upravlenie polzovatelyami", href: "/admin/users", icon: Users },
    { label: "Redaktirovat raspisanie", href: "/admin/schedule", icon: Eye },
      ];

  return (
        <div className="space-y-8">
              <div className="flex items-center justify-between">
                      <div>
                                <h1 className="text-3xl font-bold text-white">Panel upravleniya</h1>h1>
                                <p className="text-muted mt-1">Obzor statistiki i poslednih deystviy</p>p>
                      </div>div>
                      <Link href="/admin/content/new">
                                <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Dobavit kontent
                                </Button>Button>
                      </Link>Link>
              </div>div>
        
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="bg-dark-300 border-dark-50/20">
                                <CardContent className="p-6">
                                              <div className="flex items-center justify-between">
                                                              <div>
                                                                                <p className="text-muted text-sm">{stat.title}</p>p>
                                                                                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>p>
                                                              </div>div>
                                                              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                              </div>div>
                                              </div>div>
                                </CardContent>CardContent>
                    </Card>Card>
                  ))}
              </div>div>
        
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-dark-300 border-dark-50/20">
                                <CardHeader>
                                            <CardTitle className="text-white">Bystrye deystviya</CardTitle>CardTitle>
                                </CardHeader>CardHeader>
                                <CardContent className="space-y-3">
                                  {quickActions.map((action, index) => (
                        <Link key={index} href={action.href}>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-50 hover:bg-dark-100 transition-colors cursor-pointer">
                                                          <action.icon className="w-5 h-5 text-muted" />
                                                          <span className="text-white">{action.label}</span>span>
                                        </div>div>
                        </Link>Link>
                      ))}
                                </CardContent>CardContent>
                      </Card>Card>
              
                      <Card className="bg-dark-300 border-dark-50/20">
                                <CardHeader>
                                            <CardTitle className="text-white">Informaciya</CardTitle>CardTitle>
                                </CardHeader>CardHeader>
                                <CardContent>
                                            <p className="text-muted">
                                                          Dobro pozhalovat v panel administratora Makon TV.
                                            </p>p>
                                </CardContent>CardContent>
                      </Card>Card>
              </div>div>
        </div>div>
      );
}</div>
