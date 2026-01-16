"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types";

interface HeroBannerProps {
  movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const { t, locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (movies.length <= 1) return;
    
    const timer = setInterval(() => {
      goToNext();
    }, 8000);

    return () => clearInterval(timer);
  }, [currentIndex, movies.length]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!currentMovie) return null;

  const title = locale === "uz" && currentMovie.title_uz ? currentMovie.title_uz : currentMovie.title;
  const description = locale === "uz" && currentMovie.description_uz ? currentMovie.description_uz : currentMovie.description;

  return (
    <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentMovie.backdrop_url || currentMovie.poster_url || "/placeholder-backdrop.jpg"}
          alt={title}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-500 via-dark-500/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-dark-500/30" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-fade-in">
          {/* Category/Tag */}
          {currentMovie.categories && currentMovie.categories.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                {locale === "uz" && currentMovie.categories[0].name_uz 
                  ? currentMovie.categories[0].name_uz 
                  : currentMovie.categories[0].name}
              </span>
              {currentMovie.release_year && (
                <span className="text-muted text-sm">{currentMovie.release_year}</span>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 mb-8 line-clamp-3 max-w-xl">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href={`/watch/${currentMovie.id}`}>
              <Button size="xl" className="gap-2">
                <Play className="w-5 h-5" fill="currentColor" />
                {t("content.watch")}
              </Button>
            </Link>
            <Link href={`/watch/${currentMovie.id}`}>
              <Button size="xl" variant="secondary" className="gap-2">
                <Info className="w-5 h-5" />
                Подробнее
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark-500/50 text-white hover:bg-dark-500/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark-500/50 text-white hover:bg-dark-500/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
