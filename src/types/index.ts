export type SubscriptionTier = "basic" | "standard" | "premium" | null;
export type ContentType = "movie" | "series";
export type ContentStatus = "draft" | "published";
export type VideoSource = "youtube" | "vimeo" | "direct";
export type Language = "ru" | "uz";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  wallet_balance: number;
  subscription_tier: SubscriptionTier;
  subscription_expires_at: string | null;
  admin_access: boolean;
  admin_access_until: string | null;
  preferred_language: Language;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  title: string;
  title_uz: string | null;
  description: string;
  description_uz: string | null;
  type: ContentType;
  release_year: number;
  duration_minutes: number | null;
  poster_url: string;
  backdrop_url: string | null;
  trailer_url?: string | null;
  video_url: string | null;
  video_source: VideoSource;
  is_featured: boolean;
  is_trending: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  seasons?: Season[];
}

export interface Season {
  id: string;
  movie_id: string;
  season_number: number;
  title: string | null;
  title_uz: string | null;
  created_at: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  title_uz: string | null;
  description: string | null;
  description_uz: string | null;
  duration_minutes: number | null;
  video_url: string;
  video_source: VideoSource;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_uz: string | null;
  slug: string;
  icon: string | null;
}

export interface Collection {
  id: string;
  name: string;
  name_uz: string | null;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  items?: CollectionItem[];
}

export interface CollectionItem {
  collection_id: string;
  movie_id: string;
  display_order: number;
  movie?: Movie;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  movie_id: string;
  episode_id: string | null;
  progress_seconds: number;
  completed: boolean;
  last_watched_at: string;
  movie?: Movie;
  episode?: Episode;
}

export interface TVScheduleItem {
  id: string;
  program_title: string;
  program_title_uz: string | null;
  start_time: string;
  end_time: string;
  description: string | null;
  is_live: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  display_name_uz: string;
  price_monthly: number;
  price_6months: number;
  price_yearly: number;
  features: {
    ru: string[];
    uz: string[];
  };
  is_active: boolean;
}

export interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: Record<string, unknown>;
  created_at: string;
  admin_user?: Profile;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
