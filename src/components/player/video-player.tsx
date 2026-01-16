"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface VideoPlayerProps {
  url: string;
  title: string;
  onProgress?: (progress: { playedSeconds: number }) => void;
  initialProgress?: number;
}

export function VideoPlayer({
  url,
  title,
  onProgress,
  initialProgress = 0,
}: VideoPlayerProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className="relative w-full h-full bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Back button overlay */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-medium">{title}</span>
        </button>
      </div>

      {/* Video Player */}
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        playing={isPlaying}
        muted={isMuted}
        controls={false}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* Click to play/pause */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
      />

      {/* Bottom controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:text-primary transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-primary transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-6 h-6" />
            ) : (
              <Maximize className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
