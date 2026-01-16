"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MovieCard, MovieCardSkeleton } from "./movie-card";
import type { Movie } from "@/types";

interface ContentRowProps {
  title: string;
  movies: Movie[];
  seeAllLink?: string;
  seeAllLabel?: string;
  isLoading?: boolean;
}

export function ContentRow({
  title,
  movies,
  seeAllLink,
  seeAllLabel = "Каталог",
  isLoading = false,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
        {seeAllLink && (
          <Link
            href={seeAllLink}
            className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            {seeAllLabel}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Scrollable row */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-dark-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-500 -ml-4 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar px-4 md:px-0 scroll-smooth"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[150px] md:w-[180px]">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-[150px] md:w-[180px]"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-dark-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-500 -mr-4 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
