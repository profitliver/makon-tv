"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Play, Star, Clock, Calendar, ChevronDown, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/content/movie-card";
import { PaywallModal } from "@/components/modals/paywall-modal";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { cn, formatDuration } from "@/lib/utils";
import type { Movie, Season, Episode } from "@/types";

// Mock movie data
const mockMovie: Movie & { seasons?: Season[] } = {
  id: "1",
  title: "Оппенгеймер",
  title_uz: "Oppenheimer",
  description: "История американского физика Роберта Оппенгеймера, руководителя Манхэттенского проекта, в рамках которого во время Второй мировой войны разрабатывалось ядерное оружие. Биографическая драма рассказывает о гениальном учёном, который изменил мир навсегда.",
  description_uz: "Amerika fizigi Robert Oppenheimer haqida hikoya, Ikkinchi jahon urushi davrida yadro qurolini ishlab chiqish bo'yicha Manhattan loyihasining rahbari. Biografik drama dunyoni butunlay o'zgartirgan dahshatli olim haqida hikoya qiladi.",
  type: "movie",
  release_year: 2023,
  duration_minutes: 180,
  poster_url: "https://picsum.photos/seed/opp/400/600",
  backdrop_url: "https://picsum.photos/seed/opp-bg/1920/1080",
  trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
  video_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
  video_source: "youtube",
  is_featured: true,
  is_trending: true,
  status: "published",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  categories: [
    { id: "1", name: "Драма", name_uz: "Drama", slug: "drama", icon: null },
    { id: "2", name: "Биография", name_uz: "Biografiya", slug: "biography", icon: null },
  ],
};

const mockSeries: Movie & { seasons: Season[] } = {
  id: "7",
  title: "Ток шоу с Азизом",
  title_uz: "Aziz bilan tok shou",
  description: "Популярное ток-шоу с интересными гостями и актуальными темами. Каждый выпуск — это глубокое погружение в важные вопросы современности.",
  description_uz: "Qiziqarli mehmonlar va dolzarb mavzular bilan mashhur tok-shou. Har bir son — zamonaviy muhim masalalarga chuqur kirib borish.",
  type: "series",
  release_year: 2024,
  duration_minutes: null,
  poster_url: "https://picsum.photos/seed/talk1/400/600",
  backdrop_url: "https://picsum.photos/seed/talk1-bg/1920/1080",
  trailer_url: null,
  video_url: null,
  video_source: "youtube",
  is_featured: false,
  is_trending: false,
  status: "published",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  categories: [{ id: "5", name: "Ток шоу", name_uz: "Tok shou", slug: "talk-show", icon: null }],
  seasons: [
    {
      id: "s1",
      movie_id: "7",
      season_number: 1,
      title: "Сезон 1",
      title_uz: "1-mavsum",
      created_at: new Date().toISOString(),
      episodes: [
        {
          id: "e1",
          season_id: "s1",
          episode_number: 1,
          title: "Премьера шоу",
          title_uz: "Shou premyerasi",
          description: "Первый выпуск нового ток-шоу.",
          description_uz: "Yangi tok-shouning birinchi soni.",
          duration_minutes: 45,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_source: "youtube",
          thumbnail_url: "https://picsum.photos/seed/ep1/320/180",
          created_at: new Date().toISOString(),
        },
        {
          id: "e2",
          season_id: "s1",
          episode_number: 2,
          title: "Гость из Голливуда",
          title_uz: "Gollivuddan mehmon",
          description: "Интервью со звездой кино.",
          description_uz: "Kino yulduzi bilan intervyu.",
          duration_minutes: 50,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_source: "youtube",
          thumbnail_url: "https://picsum.photos/seed/ep2/320/180",
          created_at: new Date().toISOString(),
        },
        {
          id: "e3",
          season_id: "s1",
          episode_number: 3,
          title: "Технологии будущего",
          title_uz: "Kelajak texnologiyalari",
          description: "Обсуждение IT-трендов.",
          description_uz: "IT trendlarini muhokama qilish.",
          duration_minutes: 48,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_source: "youtube",
          thumbnail_url: "https://picsum.photos/seed/ep3/320/180",
          created_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: "s2",
      movie_id: "7",
      season_number: 2,
      title: "Сезон 2",
      title_uz: "2-mavsum",
      created_at: new Date().toISOString(),
      episodes: [
        {
          id: "e4",
          season_id: "s2",
          episode_number: 1,
          title: "Новый сезон",
          title_uz: "Yangi mavsum",
          description: "Возвращение шоу.",
          description_uz: "Shou qaytishi.",
          duration_minutes: 52,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          video_source: "youtube",
          thumbnail_url: "https://picsum.photos/seed/ep4/320/180",
          created_at: new Date().toISOString(),
        },
      ],
    },
  ],
};

const relatedMovies: Movie[] = [
  {
    id: "2",
    title: "Паразиты",
    title_uz: "Parazitlar",
    description: "",
    description_uz: "",
    type: "movie",
    release_year: 2019,
    duration_minutes: 132,
    poster_url: "https://picsum.photos/seed/para/400/600",
    backdrop_url: null,
    video_url: null,
    video_source: "youtube",
    is_featured: false,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [],
  },
  {
    id: "3",
    title: "Бедные-несчастные",
    title_uz: "Bechora narsalar",
    description: "",
    description_uz: "",
    type: "movie",
    release_year: 2023,
    duration_minutes: 141,
    poster_url: "https://picsum.photos/seed/poor/400/600",
    backdrop_url: null,
    video_url: null,
    video_source: "youtube",
    is_featured: false,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [],
  },
  {
    id: "6",
    title: "Интерстеллар",
    title_uz: "Interstellar",
    description: "",
    description_uz: "",
    type: "movie",
    release_year: 2014,
    duration_minutes: 169,
    poster_url: "https://picsum.photos/seed/inter/400/600",
    backdrop_url: null,
    video_url: null,
    video_source: "youtube",
    is_featured: false,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [],
  },
];

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { user, canWatch, isAuthenticated } = useAuthStore();
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  // For demo, show series if id is "7", otherwise show movie
  const isSeries = params.id === "7";
  const content = isSeries ? mockSeries : mockMovie;
  
  const title = locale === "uz" && content.title_uz ? content.title_uz : content.title;
  const description = locale === "uz" && content.description_uz ? content.description_uz : content.description;

  const handleWatch = (videoUrl?: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (!canWatch()) {
      setShowPaywall(true);
      return;
    }
    
    // Navigate to player
    router.push(`/player/${params.id}`);
  };

  const currentSeason = isSeries && mockSeries.seasons ? mockSeries.seasons[selectedSeason] : null;

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] md:min-h-[70vh]">
        {/* Backdrop */}
        <div className="absolute inset-0">
          <Image
            src={content.backdrop_url || content.poster_url || "/placeholder-backdrop.jpg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-500 via-dark-500/80 to-dark-500/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-dark-500/50" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 pt-32 pb-12 flex items-end min-h-[60vh] md:min-h-[70vh]">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={content.poster_url || "/placeholder-poster.jpg"}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 max-w-2xl">
              {/* Categories */}
              {content.categories && content.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {content.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full"
                    >
                      {locale === "uz" && cat.name_uz ? cat.name_uz : cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-muted mb-6">
                {content.release_year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {content.release_year}
                  </span>
                )}
                {content.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(content.duration_minutes)}
                  </span>
                )}
                {content.is_trending && (
                  <span className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4" fill="currentColor" />
                    {locale === "uz" ? "Trendda" : "В тренде"}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-white/80 text-lg mb-8 line-clamp-4">
                {description}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="xl" onClick={() => handleWatch()} className="gap-2">
                  <Play className="w-5 h-5" fill="currentColor" />
                  {t("content.watch")}
                </Button>
                {content.trailer_url && (
                  <Button
                    size="xl"
                    variant="secondary"
                    onClick={() => window.open(content.trailer_url!, "_blank")}
                    className="gap-2"
                  >
                    {t("content.trailer")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Series Episodes */}
      {isSeries && mockSeries.seasons && (
        <section className="container mx-auto px-4 py-8">
          {/* Season selector */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {t("content.episodes")}
            </h2>
            
            <div className="relative">
              <button
                onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-dark-50 rounded-lg text-white hover:bg-dark-100 transition-colors"
              >
                {currentSeason && (locale === "uz" && currentSeason.title_uz ? currentSeason.title_uz : currentSeason.title)}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSeasonDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSeasonDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-dark-300 rounded-lg shadow-xl z-50 overflow-hidden">
                    {mockSeries.seasons.map((season, index) => (
                      <button
                        key={season.id}
                        onClick={() => {
                          setSelectedSeason(index);
                          setShowSeasonDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-dark-50 transition-colors",
                          selectedSeason === index ? "text-primary bg-primary/10" : "text-white"
                        )}
                      >
                        {locale === "uz" && season.title_uz ? season.title_uz : season.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Episodes list */}
          <div className="space-y-4">
            {currentSeason?.episodes?.map((episode) => (
              <div
                key={episode.id}
                className="flex gap-4 p-4 bg-dark-300 rounded-xl hover:bg-dark-200 transition-colors cursor-pointer group"
                onClick={() => handleWatch(episode.video_url)}
              >
                {/* Thumbnail */}
                <div className="relative w-40 md:w-56 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={episode.thumbnail_url || "/placeholder-episode.jpg"}
                    alt={episode.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Play className="w-5 h-5 text-dark-500 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-white font-medium mb-1">
                        {episode.episode_number}. {locale === "uz" && episode.title_uz ? episode.title_uz : episode.title}
                      </h3>
                      <p className="text-muted text-sm line-clamp-2">
                        {locale === "uz" && episode.description_uz ? episode.description_uz : episode.description}
                      </p>
                    </div>
                    {episode.duration_minutes && (
                      <span className="text-muted text-sm flex-shrink-0">
                        {episode.duration_minutes} {t("content.minutes")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Content */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {t("content.related")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <Footer />

      {/* Paywall Modal */}
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
