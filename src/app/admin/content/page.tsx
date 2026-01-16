"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const mockContent = [
  {
    id: "1",
    title: "Оппенгеймер",
    title_uz: "Oppenheimer",
    type: "movie",
    status: "published",
    release_year: 2023,
    poster_url: "https://picsum.photos/seed/opp/100/150",
    created_at: "2024-01-15",
  },
  {
    id: "2",
    title: "Паразиты",
    title_uz: "Parazitlar",
    type: "movie",
    status: "published",
    release_year: 2019,
    poster_url: "https://picsum.photos/seed/para/100/150",
    created_at: "2024-01-14",
  },
  {
    id: "7",
    title: "Ток шоу с Азизом",
    title_uz: "Aziz bilan tok shou",
    type: "series",
    status: "published",
    release_year: 2024,
    poster_url: "https://picsum.photos/seed/talk1/100/150",
    created_at: "2024-01-10",
  },
  {
    id: "3",
    title: "Бедные-несчастные",
    title_uz: "Bechora narsalar",
    type: "movie",
    status: "draft",
    release_year: 2023,
    poster_url: "https://picsum.photos/seed/poor/100/150",
    created_at: "2024-01-08",
  },
];

export default function AdminContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "series">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  const filteredContent = mockContent.filter((item) => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType !== "all" && item.type !== filterType) {
      return false;
    }
    if (filterStatus !== "all" && item.status !== filterStatus) {
      return false;
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление контентом</h1>
          <p className="text-muted mt-1">Фильмы, сериалы и другой контент</p>
        </div>
        <Link href="/admin/content/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Добавить
          </Button>
        </Link>
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
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-dark-50 border border-dark-50 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="h-10 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Все типы</option>
              <option value="movie">Фильмы</option>
              <option value="series">Сериалы</option>
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="h-10 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Все статусы</option>
              <option value="published">Опубликовано</option>
              <option value="draft">Черновик</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-50/20">
                  <th className="text-left p-4 text-muted text-sm font-medium">Контент</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Тип</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Год</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Статус</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Дата</th>
                  <th className="text-right p-4 text-muted text-sm font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => (
                  <tr key={item.id} className="border-b border-dark-50/20 hover:bg-dark-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.poster_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-muted text-sm">{item.title_uz}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        item.type === "movie" 
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      )}>
                        {item.type === "movie" ? "Фильм" : "Сериал"}
                      </span>
                    </td>
                    <td className="p-4 text-white">{item.release_year}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        item.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {item.status === "published" ? "Опубликовано" : "Черновик"}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{item.created_at}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/content/${item.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          {item.status === "published" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-error hover:text-error">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">Контент не найден</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
