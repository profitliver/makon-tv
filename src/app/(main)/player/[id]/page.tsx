"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { VideoPlayer } from "@/components/player/video-player";

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { canWatch, isAuthenticated, isLoading } = useAuthStore();
  
  // Mock video data
  const videoUrl = "https://www.youtube.com/watch?v=uYPbbksJxIg";
  const title = "Оппенгеймер";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      
      if (!canWatch()) {
        router.push(`/watch/${params.id}`);
      }
    }
  }, [isLoading, isAuthenticated, canWatch, params.id, router]);

  if (isLoading || !isAuthenticated || !canWatch()) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <VideoPlayer
        url={videoUrl}
        title={title}
        onProgress={(progress) => {
          // Save progress to database
          console.log("Progress:", progress.playedSeconds);
        }}
      />
    </div>
  );
}
