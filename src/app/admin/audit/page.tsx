"use client";

import React, { useState } from "react";
import { Search, Filter, FileText, User, Film, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const mockAuditLogs = [
  {
    id: "1",
    admin_email: "admin@makontv.uz",
    action: "create",
    entity_type: "movie",
    entity_name: "Оппенгеймер",
    changes: { title: "Оппенгеймер", status: "published" },
    created_at: "2024-01-15T14:30:00",
  },
  {
    id: "2",
    admin_email: "admin@makontv.uz",
    action: "update",
    entity_type: "user",
    entity_name: "user@test.com",
    changes: { admin_access: true },
    created_at: "2024-01-15T12:15:00",
  },
  {
    id: "3",
    admin_email: "admin@makontv.uz",
    action: "update",
    entity_type: "movie",
    entity_name: "Паразиты",
    changes: { is_trending: true },
    created_at: "2024-01-14T16:45:00",
  },
  {
    id: "4",
    admin_email: "admin@makontv.uz",
    action: "create",
    entity_type: "season",
    entity_name: "Ток шоу с Азизом - Сезон 2",
    changes: { season_number: 2 },
    created_at: "2024-01-14T10:00:00",
  },
  {
    id: "5",
    admin_email: "admin@makontv.uz",
    action: "delete",
    entity_type: "collection",
    entity_name: "Старые фильмы",
    changes: {},
    created_at: "2024-01-13T18:30:00",
  },
  {
    id: "6",
    admin_email: "admin@makontv.uz",
    action: "update",
    entity_type: "schedule",
    entity_name: "Понедельник",
    changes: { programs: 12 },
    created_at: "2024-01-13T09:00:00",
  },
  {
    id: "7",
    admin_email: "admin@makontv.uz",
    action: "update",
    entity_type: "user",
    entity_name: "premium@test.com",
    changes: { wallet_balance: 100000 },
    created_at: "2024-01-12T15:20:00",
  },
];

const actionLabels: Record<string, { label: string; color: string }> = {
  create: { label: "Создание", color: "bg-green-500/20 text-green-400" },
  update: { label: "Изменение", color: "bg-blue-500/20 text-blue-400" },
  delete: { label: "Удаление", color: "bg-red-500/20 text-red-400" },
};

const entityLabels: Record<string, string> = {
  movie: "Фильм",
  series: "Сериал",
  user: "Пользователь",
  season: "Сезон",
  episode: "Эпизод",
  collection: "Подборка",
  schedule: "Расписание",
};

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterEntity, setFilterEntity] = useState<string>("all");

  const filteredLogs = mockAuditLogs.filter((log) => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (!log.entity_name.toLowerCase().includes(search) &&
          !log.admin_email.toLowerCase().includes(search)) {
        return false;
      }
    }
    if (filterAction !== "all" && log.action !== filterAction) return false;
    if (filterEntity !== "all" && log.entity_type !== filterEntity) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Журнал действий</h1>
          <p className="text-muted mt-1">История всех действий администраторов</p>
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
                placeholder="Поиск по объекту или админу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-dark-50 border border-dark-50 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Action filter */}
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="h-10 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Все действия</option>
              <option value="create">Создание</option>
              <option value="update">Изменение</option>
              <option value="delete">Удаление</option>
            </select>

            {/* Entity filter */}
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="h-10 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Все типы</option>
              <option value="movie">Фильмы</option>
              <option value="series">Сериалы</option>
              <option value="user">Пользователи</option>
              <option value="collection">Подборки</option>
              <option value="schedule">Расписание</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-50/20">
                  <th className="text-left p-4 text-muted text-sm font-medium">Дата и время</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Администратор</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Действие</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Тип</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Объект</th>
                  <th className="text-left p-4 text-muted text-sm font-medium">Изменения</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-dark-50/20 hover:bg-dark-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-muted">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDateTime(log.created_at)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-white text-sm">{log.admin_email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        actionLabels[log.action]?.color
                      )}>
                        {actionLabels[log.action]?.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white text-sm">
                        {entityLabels[log.entity_type] || log.entity_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">{log.entity_name}</span>
                    </td>
                    <td className="p-4">
                      <code className="text-xs text-muted bg-dark-50 px-2 py-1 rounded">
                        {JSON.stringify(log.changes)}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted">Записи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
