"use client";

import React, { useState } from "react";
import { Radio, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn, formatTime } from "@/lib/utils";

const days = [
  { id: 0, name: "Пн", nameUz: "Du", fullName: "Понедельник", fullNameUz: "Dushanba" },
  { id: 1, name: "Вт", nameUz: "Se", fullName: "Вторник", fullNameUz: "Seshanba" },
  { id: 2, name: "Ср", nameUz: "Ch", fullName: "Среда", fullNameUz: "Chorshanba" },
  { id: 3, name: "Чт", nameUz: "Pa", fullName: "Четверг", fullNameUz: "Payshanba" },
  { id: 4, name: "Пт", nameUz: "Ju", fullName: "Пятница", fullNameUz: "Juma" },
  { id: 5, name: "Сб", nameUz: "Sh", fullName: "Суббота", fullNameUz: "Shanba" },
  { id: 6, name: "Вс", nameUz: "Ya", fullName: "Воскресенье", fullNameUz: "Yakshanba" },
];

const mockSchedule = [
  {
    id: "1",
    program_title: "Утренние новости",
    program_title_uz: "Ertalabki yangiliklar",
    start_time: "2024-01-15T06:00:00",
    end_time: "2024-01-15T08:00:00",
    is_live: false,
  },
  {
    id: "2",
    program_title: "Ток-шоу 'Доброе утро'",
    program_title_uz: "Tok-shou 'Xayrli tong'",
    start_time: "2024-01-15T08:00:00",
    end_time: "2024-01-15T10:00:00",
    is_live: true,
  },
  {
    id: "3",
    program_title: "Документальный фильм",
    program_title_uz: "Hujjatli film",
    start_time: "2024-01-15T10:00:00",
    end_time: "2024-01-15T11:30:00",
    is_live: false,
  },
  {
    id: "4",
    program_title: "Кулинарное шоу",
    program_title_uz: "Pazandachilik shousi",
    start_time: "2024-01-15T11:30:00",
    end_time: "2024-01-15T12:30:00",
    is_live: false,
  },
  {
    id: "5",
    program_title: "Дневные новости",
    program_title_uz: "Kunduzi yangiliklar",
    start_time: "2024-01-15T12:30:00",
    end_time: "2024-01-15T13:00:00",
    is_live: false,
  },
  {
    id: "6",
    program_title: "Сериал 'Семейные истории'",
    program_title_uz: "Serial 'Oilaviy hikoyalar'",
    start_time: "2024-01-15T13:00:00",
    end_time: "2024-01-15T14:00:00",
    is_live: false,
  },
  {
    id: "7",
    program_title: "Музыкальная программа",
    program_title_uz: "Musiqiy dastur",
    start_time: "2024-01-15T14:00:00",
    end_time: "2024-01-15T15:00:00",
    is_live: false,
  },
  {
    id: "8",
    program_title: "Детское шоу",
    program_title_uz: "Bolalar shousi",
    start_time: "2024-01-15T15:00:00",
    end_time: "2024-01-15T16:30:00",
    is_live: false,
  },
  {
    id: "9",
    program_title: "Спортивные новости",
    program_title_uz: "Sport yangiliklari",
    start_time: "2024-01-15T16:30:00",
    end_time: "2024-01-15T17:00:00",
    is_live: false,
  },
  {
    id: "10",
    program_title: "Вечерние новости",
    program_title_uz: "Kechki yangiliklar",
    start_time: "2024-01-15T19:00:00",
    end_time: "2024-01-15T20:00:00",
    is_live: false,
  },
  {
    id: "11",
    program_title: "Прайм-тайм шоу",
    program_title_uz: "Praym-taym shousi",
    start_time: "2024-01-15T20:00:00",
    end_time: "2024-01-15T22:00:00",
    is_live: false,
  },
  {
    id: "12",
    program_title: "Ночной кинопоказ",
    program_title_uz: "Tungi kinoseans",
    start_time: "2024-01-15T22:00:00",
    end_time: "2024-01-16T00:00:00",
    is_live: false,
  },
];

export default function SchedulePage() {
  const { t, locale } = useI18n();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const currentHour = new Date().getHours();

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t("schedule.title")}
              </h1>
              <p className="text-muted">
                {locale === "uz" ? "Makon TV teledasturi" : "Программа передач Makon TV"}
              </p>
            </div>
            <Button className="gap-2" variant="secondary">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              {t("schedule.live")}
            </Button>
          </div>

          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
            {days.map((day, index) => {
              const isToday = index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    "flex flex-col items-center min-w-[80px] px-4 py-3 rounded-xl transition-colors",
                    selectedDay === index
                      ? "bg-primary text-dark-500"
                      : "bg-dark-50 text-white hover:bg-dark-100"
                  )}
                >
                  <span className="text-sm font-medium">
                    {locale === "uz" ? day.nameUz : day.name}
                  </span>
                  <span className="text-xs mt-1 opacity-70">
                    {isToday ? (locale === "uz" ? "Bugun" : "Сегодня") : ""}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Schedule list */}
          <div className="space-y-3">
            {mockSchedule.map((item) => {
              const startHour = new Date(item.start_time).getHours();
              const endHour = new Date(item.end_time).getHours();
              const isNow = item.is_live || (currentHour >= startHour && currentHour < endHour);
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl transition-colors",
                    isNow
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-dark-300 hover:bg-dark-200"
                  )}
                >
                  {/* Time */}
                  <div className="w-24 flex-shrink-0 text-center">
                    <p className={cn(
                      "text-lg font-semibold",
                      isNow ? "text-primary" : "text-white"
                    )}>
                      {formatTime(item.start_time)}
                    </p>
                    <p className="text-muted text-sm">
                      — {formatTime(item.end_time)}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    "w-1 h-12 rounded-full",
                    isNow ? "bg-primary" : "bg-dark-50"
                  )} />

                  {/* Program info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isNow && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                          <Radio className="w-3 h-3" />
                          {t("schedule.live")}
                        </span>
                      )}
                      <h3 className={cn(
                        "font-medium",
                        isNow ? "text-primary" : "text-white"
                      )}>
                        {locale === "uz" && item.program_title_uz 
                          ? item.program_title_uz 
                          : item.program_title}
                      </h3>
                    </div>
                  </div>

                  {/* Watch button */}
                  {isNow && (
                    <Button size="sm">
                      {t("content.watch")}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
