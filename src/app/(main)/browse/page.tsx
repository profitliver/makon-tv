"use client";

import React, { useState } from "react";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MovieCard, MovieCardSkeleton } from "@/components/content/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Movie, Category } from "@/types";

// Mock data
const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Оппенгеймер",
    title_uz: "Oppenheimer",
    description: "История американского физика Роберта Оппенгеймера.",
    description_uz: "Amerika fizigi Robert Oppenheimer haqida hikoya.",
    type: "movie",
    release_year: 2023,
    duration_minutes: 180,
    poster_url: "https://picsum.photos/seed/opp/400/600",
    backdrop_url: null,
    video_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    video_source: "youtube",
    is_featured: true,
    is_trending: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "1", name: "Драма", name_uz: "Drama", slug: "drama", icon: null }],
  },
  {
    id: "2",
    title: "Паразиты",
    title_uz: "Parazitlar",
    description: "Семья Ким живет в маленькой грязной квартире.",
    description_uz: "Kim oilasi kichik va iflos kvartirada yashaydi.",
    type: "movie",
    release_year: 2019,
    duration_minutes: 132,
    poster_url: "https://picsum.photos/seed/para/400/600",
    backdrop_url: null,
    video_url: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    video_source: "youtube",
    is_featured: true,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "2", name: "Триллер", name_uz: "Triller", slug: "thriller", icon: null }],
  },
  {
    id: "3",
    title: "Бедные-несчастные",
    title_uz: "Bechora narsalar",
    description: "История невероятного перевоплощения Беллы Бакстер.",
    description_uz: "Bella Baksterning ajoyib o'zgarishi haqida hikoya.",
    type: "movie",
    release_year: 2023,
    duration_minutes: 141,
    poster_url: "https://picsum.photos/seed/poor/400/600",
    backdrop_url: null,
    video_url: "https://www.youtube.com/watch?v=RlbR5N6veqw",
    video_source: "youtube",
    is_featured: false,
    is_trending: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "1", name: "Драма", name_uz: "Drama", slug: "drama", icon: null }],
  },
  {
    id: "4",
    title: "Вонка",
    title_uz: "Vonka",
    description: "История молодого Вилли Вонки.",
    description_uz: "Yosh Villi Vonka haqida hikoya.",
    type: "movie",
    release_year: 2023,
    duration_minutes: 116,
    poster_url: "https://picsum.photos/seed/wonka/400/600",
    backdrop_url: null,
    video_url: "https://www.youtube.com/watch?v=otNh9bTjXWg",
    video_source: "youtube",
    is_featured: false,
    is_trending: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "3", name: "Приключения", name_uz: "Sarguzasht", slug: "adventure", icon: null }],
  },
  {
    id: "5",
    title: "Плохой гений",
    title_uz: "Yomon daho",
    description: "Линн — гениальная студентка.",
    description_uz: "Lin — dahshatli talaba.",
    type: "movie",
    release_year: 2017,
    duration_minutes: 130,
    poster_url: "https://picsum.photos/seed/badgen/400/600",
    backdrop_url: null,
    video_url: "https://www.youtube.com/watch?v=CLYhHwFwbw4",
    video_source: "youtube",
    is_featured: false,
    is_trending: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "2", name: "Триллер", name_uz: "Triller", slug: "thriller", icon: null }],
  },
  {
    id: "6",
    title: "Интерстеллар",
    title_uz: "Interstellar",
    description: "Когда Земля становится непригодной для жизни.",
    description_uz: "Yer yashash uchun yaroqsiz bo'lganda.",
    type: "movie",
    release_year: 2014,
    duration_minutes: 169,
    poster_url: "https://picsum.photos/seed/inter/400/600",
    backdrop_url: null,
    video_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    video_source: "youtube",
    is_featured: false,
    is_trending: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "4", name: "Фантастика", name_uz: "Fantastika", slug: "sci-fi", icon: null }],
  },
  {
    id: "7",
    title: "Ток шоу с Азизом",
    title_uz: "Aziz bilan tok shou",
    description: "Популярное ток-шоу.",
    description_uz: "Mashhur tok-shou.",
    type: "series",
    release_year: 2024,
    duration_minutes: null,
    poster_url: "https://picsum.photos/seed/talk1/400/600",
    backdrop_url: null,
    video_url: null,
    video_source: "youtube",
    is_featured: false,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "5", name: "Ток шоу", name_uz: "Tok shou", slug: "talk-show", icon: null }],
  },
  {
    id: "8",
    title: "Узбекистан завтра",
    title_uz: "Ertangi O'zbekiston",
    description: "Документальный сериал о развитии страны.",
    description_uz: "Mamlakatning rivojlanishi haqida hujjatli serial.",
    type: "series",
    release_year: 2024,
    duration_minutes: null,
    poster_url: "https://picsum.photos/seed/doc1/400/600",
    backdrop_url: null,
    video_url: null,
    video_source: "youtube",
    is_featured: false,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "6", name: "Документальный", name_uz: "Hujjatli", slug: "documentary", icon: null }],
  },
];

const categories: Category[] = [
  { id: "all", name: "Все", name_uz: "Hammasi", slug: "all", icon: null },
  { id: "1", name: "Драма", name_uz: "Drama", slug: "drama", icon: null },
  { id: "2", name: "Триллер", name_uz: "Triller", slug: "thriller", icon: null },
  { id: "3", name: "Комедия", name_uz: "Komediya", slug: "comedy", icon: null },
  { id: "4", name: "Фантастика", name_uz: "Fantastika", slug: "sci-fi", icon: null },
  { id: "5", name: "Боевик", name_uz: "Jangari", slug: "action", icon: null },
  { id: "6", name: "Документальный", name_uz: "Hujjatli", slug: "documentary", icon: null },
];

const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function BrowsePage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | "movie" | "series">("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "alphabetical">("latest");
  const [showFilters, setShowFilters] = useState(false);

  // Filter movies
  const filteredMovies = mockMovies.filter((movie) => {
    const title = locale === "uz" && movie.title_uz ? movie.title_uz : movie.title;
    
    if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedCategory !== "all" && !movie.categories?.some(c => c.id === selectedCategory)) {
      return false;
    }
    
    if (selectedType !== "all" && movie.type !== selectedType) {
      return false;
    }
    
    if (selectedYear && movie.release_year !== selectedYear) {
      return false;
    }
    
    return true;
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0);
      case "alphabetical":
        const titleA = locale === "uz" && a.title_uz ? a.title_uz : a.title;
        const titleB = locale === "uz" && b.title_uz ? b.title_uz : b.title;
        return titleA.localeCompare(titleB);
      default:
        return b.release_year - a.release_year;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t("nav.catalog")}
            </h1>
            <p className="text-muted">
              {locale === "uz" ? "Barcha kontent bir joyda" : "Весь контент в одном месте"}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder={t("common.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-lg bg-dark-50 border border-dark-50 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-5 h-5" />
                {t("content.filters")}
              </Button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="p-6 rounded-xl bg-dark-300 border border-dark-50/20 space-y-6 animate-slide-down">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {t("content.genre")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          selectedCategory === cat.id
                            ? "bg-primary text-dark-500"
                            : "bg-dark-50 text-white hover:bg-dark-100"
                        )}
                      >
                        {locale === "uz" && cat.name_uz ? cat.name_uz : cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {locale === "uz" ? "Turi" : "Тип"}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedType("all")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedType === "all"
                          ? "bg-primary text-dark-500"
                          : "bg-dark-50 text-white hover:bg-dark-100"
                      )}
                    >
                      {t("content.all")}
                    </button>
                    <button
                      onClick={() => setSelectedType("movie")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedType === "movie"
                          ? "bg-primary text-dark-500"
                          : "bg-dark-50 text-white hover:bg-dark-100"
                      )}
                    >
                      {t("content.movies")}
                    </button>
                    <button
                      onClick={() => setSelectedType("series")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedType === "series"
                          ? "bg-primary text-dark-500"
                          : "bg-dark-50 text-white hover:bg-dark-100"
                      )}
                    >
                      {t("content.series")}
                    </button>
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {t("content.year")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedYear(null)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedYear === null
                          ? "bg-primary text-dark-500"
                          : "bg-dark-50 text-white hover:bg-dark-100"
                      )}
                    >
                      {t("content.all")}
                    </button>
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          selectedYear === year
                            ? "bg-primary text-dark-500"
                            : "bg-dark-50 text-white hover:bg-dark-100"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sort and results count */}
            <div className="flex items-center justify-between">
              <p className="text-muted text-sm">
                {locale === "uz" 
                  ? `${sortedMovies.length} ta natija topildi`
                  : `Найдено ${sortedMovies.length} результатов`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-muted text-sm">{t("content.sortBy")}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-dark-50 border border-dark-50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="latest">{t("content.latest")}</option>
                  <option value="popular">{t("content.popular")}</option>
                  <option value="alphabetical">{t("content.alphabetical")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Movies Grid */}
          {sortedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} showBadge />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted text-lg">{t("common.noResults")}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
