"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categories = [
  { id: "1", name: "Драма" },
  { id: "2", name: "Триллер" },
  { id: "3", name: "Комедия" },
  { id: "4", name: "Фантастика" },
  { id: "5", name: "Боевик" },
  { id: "6", name: "Документальный" },
  { id: "7", name: "Ток шоу" },
];

export default function AdminContentNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || "movie";

  const [formData, setFormData] = useState({
    title: "",
    title_uz: "",
    description: "",
    description_uz: "",
    type: defaultType,
    release_year: new Date().getFullYear(),
    duration_minutes: "",
    poster_url: "",
    backdrop_url: "",
    trailer_url: "",
    video_url: "",
    video_source: "youtube",
    is_featured: false,
    is_trending: false,
    status: "draft",
    categories: [] as string[],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    router.push("/admin/content");
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/content">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {formData.type === "movie" ? "Добавить фильм" : "Добавить сериал"}
          </h1>
          <p className="text-muted mt-1">Заполните информацию о контенте</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type selector */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Тип контента</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: "movie" }))}
                      className={cn(
                        "flex-1 py-3 rounded-lg border transition-colors",
                        formData.type === "movie"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-dark-50 border-dark-50 text-white hover:border-primary/50"
                      )}
                    >
                      Фильм
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: "series" }))}
                      className={cn(
                        "flex-1 py-3 rounded-lg border transition-colors",
                        formData.type === "series"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-dark-50 border-dark-50 text-white hover:border-primary/50"
                      )}
                    >
                      Сериал
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Название (RU) *"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Введите название на русском"
                    required
                  />
                  <Input
                    label="Название (UZ)"
                    value={formData.title_uz}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_uz: e.target.value }))}
                    placeholder="Введите название на узбекском"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Описание (RU) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Введите описание на русском"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-dark-50 border border-dark-50 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Описание (UZ)</label>
                  <textarea
                    value={formData.description_uz}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_uz: e.target.value }))}
                    placeholder="Введите описание на узбекском"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-dark-50 border border-dark-50 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Год выпуска"
                    type="number"
                    value={formData.release_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, release_year: parseInt(e.target.value) }))}
                  />
                  {formData.type === "movie" && (
                    <Input
                      label="Длительность (мин)"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      placeholder="180"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle>Медиафайлы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="URL постера"
                  value={formData.poster_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, poster_url: e.target.value }))}
                  placeholder="https://example.com/poster.jpg"
                />
                <Input
                  label="URL фона (backdrop)"
                  value={formData.backdrop_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, backdrop_url: e.target.value }))}
                  placeholder="https://example.com/backdrop.jpg"
                />
                <Input
                  label="Ссылка на трейлер"
                  value={formData.trailer_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, trailer_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
                {formData.type === "movie" && (
                  <>
                    <Input
                      label="Ссылка на видео"
                      value={formData.video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Источник видео</label>
                      <select
                        value={formData.video_source}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_source: e.target.value }))}
                        className="w-full h-12 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="direct">Прямая ссылка</option>
                      </select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Категории</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        formData.categories.includes(cat.id)
                          ? "bg-primary text-dark-500"
                          : "bg-dark-50 text-white hover:bg-dark-100"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                  <span className="text-white">Рекомендуемое</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      formData.is_featured ? "bg-primary" : "bg-dark-100"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                        formData.is_featured ? "left-6" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                  <span className="text-white">В тренде</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_trending: !prev.is_trending }))}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      formData.is_trending ? "bg-primary" : "bg-dark-100"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                        formData.is_trending ? "left-6" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Статус</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full h-12 px-4 rounded-lg bg-dark-50 border border-dark-50 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликовано</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Button type="submit" className="w-full gap-2" size="lg" loading={isSaving}>
              <Save className="w-4 h-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
