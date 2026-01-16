"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroBanner } from "@/components/content/hero-banner";
import { ContentRow } from "@/components/content/content-row";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import type { Movie, Category } from "@/types";

// Mock data for demo
const mockFeaturedMovies: Movie[] = [
  {
    id: "1",
    title: "Оппенгеймер",
    title_uz: "Oppenheimer",
    description: "История американского физика Роберта Оппенгеймера, руководителя Манхэттенского проекта, в рамках которого во время Второй мировой войны разрабатывалось ядерное оружие.",
    description_uz: "Amerika fizigi Robert Oppenheimer haqida hikoya, Ikkinchi jahon urushi davrida yadro qurolini ishlab chiqish bo'yicha Manhattan loyihasining rahbari.",
    type: "movie",
    release_year: 2023,
    duration_minutes: 180,
    poster_url: "https://picsum.photos/seed/opp/400/600",
    backdrop_url: "https://picsum.photos/seed/opp-bg/1920/1080",
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
    description: "Семья Ким живет в маленькой грязной квартире и еле сводит концы с концами. Однажды сын семейства, Ки-у, получает возможность работать репетитором в богатой семье Пак.",
    description_uz: "Kim oilasi kichik va iflos kvartirada yashaydi va zo'rg'a tirikchilik qiladi. Bir kuni oilaning o'g'li Ki-u boy Pak oilasida repetitor bo'lib ishlash imkoniyatini qo'lga kiritadi.",
    type: "movie",
    release_year: 2019,
    duration_minutes: 132,
    poster_url: "https://picsum.photos/seed/para/400/600",
    backdrop_url: "https://picsum.photos/seed/para-bg/1920/1080",
    video_url: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    video_source: "youtube",
    is_featured: true,
    is_trending: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: [{ id: "2", name: "Триллер", name_uz: "Triller", slug: "thriller", icon: null }],
  },
];

const mockTrendingMovies: Movie[] = [
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
    description: "История молодого Вилли Вонки, показывающая, как он познакомился с умпа-лумпами и открыл знаменитую шоколадную фабрику.",
    description_uz: "Yosh Villi Vonka haqida hikoya, u umpa-lumpalar bilan qanday tanishgani va mashhur shokolad fabrikasini qanday ochgani.",
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
    description: "Линн — гениальная студентка, которая зарабатывает деньги, помогая своим одноклассникам списывать на экзаменах.",
    description_uz: "Lin — dahshatli talaba, u o'z sinfdoshlariga imtihonlarda ko'chirib olishga yordam berib pul topadi.",
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
    description: "Когда Земля становится непригодной для жизни, группа исследователей отправляется сквозь червоточину около Сатурна в поисках нового дома для человечества.",
    description_uz: "Yer yashash uchun yaroqsiz bo'lganda, tadqiqotchilar guruhi insoniyat uchun yangi uy izlab Saturn yaqinidagi chuvalchang teshigidan o'tadi.",
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
];

const mockSeries: Movie[] = [
  {
    id: "7",
    title: "Ток шоу с Азизом",
    title_uz: "Aziz bilan tok shou",
    description: "Популярное ток-шоу с интересными гостями и актуальными темами.",
    description_uz: "Qiziqarli mehmonlar va dolzarb mavzular bilan mashhur tok-shou.",
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
    description: "Документальный сериал о развитии страны и её будущем.",
    description_uz: "Mamlakatning rivojlanishi va kelajagi haqida hujjatli serial.",
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
  { id: "humor", name: "Юмор", name_uz: "Hazil", slug: "humor", icon: null },
  { id: "news", name: "Новости", name_uz: "Yangiliklar", slug: "news", icon: null },
  { id: "tech", name: "Техно", name_uz: "Texno", slug: "tech", icon: null },
];

export default function HomePage() {
  const { t, locale } = useI18n();
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      {/* Hero Banner */}
      <HeroBanner movies={mockFeaturedMovies} />

      {/* Live TV Button */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <Link href="/schedule">
          <Button size="lg" variant="secondary" className="w-full md:w-auto gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            {t("content.liveNow")}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 md:px-0 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-dark-500"
                  : "bg-dark-50 text-white hover:bg-dark-100"
              }`}
            >
              {locale === "uz" && cat.name_uz ? cat.name_uz : cat.name}
            </button>
          ))}
        </div>

        {/* Trending */}
        <ContentRow
          title={t("content.trending")}
          movies={mockTrendingMovies}
          seeAllLink="/browse?sort=trending"
          seeAllLabel={t("content.allContent")}
        />

        {/* Talk Shows */}
        <ContentRow
          title={t("content.talkShow")}
          movies={mockSeries}
          seeAllLink="/browse?category=talk-show"
          seeAllLabel={t("content.allContent")}
        />

        {/* Reality Shows */}
        <ContentRow
          title={t("content.realityShow")}
          movies={[...mockTrendingMovies].reverse()}
          seeAllLink="/browse?category=reality-show"
          seeAllLabel={t("content.allContent")}
        />

        {/* Music Shows */}
        <ContentRow
          title={t("content.musicShow")}
          movies={mockTrendingMovies.slice(0, 4)}
          seeAllLink="/browse?category=music-show"
          seeAllLabel={t("content.allContent")}
        />
      </main>

      <Footer />
    </div>
  );
}
