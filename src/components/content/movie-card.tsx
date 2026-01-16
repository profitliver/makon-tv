"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  variant?: "default" | "wide" | "compact";
  showBadge?: boolean;
}

export function MovieCard({ movie, variant = "default", showBadge = false }: MovieCardProps) {
  const { locale } = useI18n();
  
  const title = locale === "uz" && movie.title_uz ? movie.title_uz : movie.title;
  
  const aspectRatio = variant === "wide" ? "aspect-video" : "aspect-[2/3]";
  
  return (
    <Link href={`/watch/${movie.id}`} className="group block">
      <div className={cn(
        "relative overflow-hidden rounded-lg card-hover",
        aspectRatio
      )}>
        <Image
          src={movie.poster_url || "/placeholder-poster.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-dark-500 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Badge */}
        {showBadge && movie.is_trending && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-dark-500 text-xs font-medium rounded">
            Тренд
          </div>
        )}
        
        {/* Content info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-medium text-sm line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted">
            {movie.release_year && <span>{movie.release_year}</span>}
            {movie.duration_minutes && (
              <>
                <span>•</span>
                <span>{movie.duration_minutes} мин</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Title below card for non-hover view */}
      {variant === "default" && (
        <div className="mt-2">
          <h3 className="text-white text-sm font-medium line-clamp-1">{title}</h3>
          {movie.categories && movie.categories.length > 0 && (
            <p className="text-muted text-xs mt-0.5 line-clamp-1">
              {movie.categories.map(c => locale === "uz" && c.name_uz ? c.name_uz : c.name).join(" • ")}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}

export function MovieCardSkeleton({ variant = "default" }: { variant?: "default" | "wide" | "compact" }) {
  const aspectRatio = variant === "wide" ? "aspect-video" : "aspect-[2/3]";
  
  return (
    <div>
      <div className={cn("skeleton rounded-lg", aspectRatio)} />
      {variant === "default" && (
        <div className="mt-2 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      )}
    </div>
  );
}
