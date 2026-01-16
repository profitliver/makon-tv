-- =====================================================
-- MAKON TV - Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE subscription_tier AS ENUM ('basic', 'standard', 'premium');
CREATE TYPE content_type AS ENUM ('movie', 'series');
CREATE TYPE content_status AS ENUM ('draft', 'published');
CREATE TYPE video_source AS ENUM ('youtube', 'vimeo', 'direct');

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  subscription_tier subscription_tier,
  subscription_expires_at TIMESTAMPTZ,
  admin_access BOOLEAN DEFAULT FALSE,
  admin_access_until TIMESTAMPTZ,
  preferred_language TEXT DEFAULT 'ru',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_uz TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- MOVIES TABLE
-- =====================================================

CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_uz TEXT,
  description TEXT NOT NULL,
  description_uz TEXT,
  type content_type NOT NULL DEFAULT 'movie',
  release_year INTEGER,
  duration_minutes INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  video_url TEXT,
  video_source video_source DEFAULT 'youtube',
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published movies" ON movies
  FOR SELECT USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins can manage movies" ON movies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- MOVIE CATEGORIES (Junction Table)
-- =====================================================

CREATE TABLE movie_categories (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, category_id)
);

ALTER TABLE movie_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view movie categories" ON movie_categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage movie categories" ON movie_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- SEASONS TABLE
-- =====================================================

CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  title TEXT,
  title_uz TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seasons" ON seasons
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage seasons" ON seasons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- EPISODES TABLE
-- =====================================================

CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  title_uz TEXT,
  description TEXT,
  description_uz TEXT,
  duration_minutes INTEGER,
  video_url TEXT,
  video_source video_source DEFAULT 'youtube',
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view episodes" ON episodes
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage episodes" ON episodes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- COLLECTIONS TABLE
-- =====================================================

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_uz TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active collections" ON collections
  FOR SELECT USING (is_active = TRUE OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins can manage collections" ON collections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- COLLECTION ITEMS TABLE
-- =====================================================

CREATE TABLE collection_items (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, movie_id)
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collection items" ON collection_items
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage collection items" ON collection_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- WATCH HISTORY TABLE
-- =====================================================

CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watch history" ON watch_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own watch history" ON watch_history
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- TV SCHEDULE TABLE
-- =====================================================

CREATE TABLE tv_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_title TEXT NOT NULL,
  program_title_uz TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  description TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tv_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedule" ON tv_schedule
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage schedule" ON tv_schedule
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- SUBSCRIPTION PLANS TABLE
-- =====================================================

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  display_name_uz TEXT,
  price_monthly DECIMAL(12,2) NOT NULL,
  price_6months DECIMAL(12,2) NOT NULL,
  price_yearly DECIMAL(12,2) NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans" ON subscription_plans
  FOR SELECT USING (is_active = TRUE);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Categories
INSERT INTO categories (name, name_uz, slug) VALUES
  ('Драма', 'Drama', 'drama'),
  ('Триллер', 'Triller', 'thriller'),
  ('Комедия', 'Komediya', 'comedy'),
  ('Фантастика', 'Fantastika', 'sci-fi'),
  ('Боевик', 'Jangari', 'action'),
  ('Приключения', 'Sarguzasht', 'adventure'),
  ('Документальный', 'Hujjatli', 'documentary'),
  ('Ток шоу', 'Tok shou', 'talk-show'),
  ('Семейный', 'Oilaviy', 'family');

-- Subscription Plans
INSERT INTO subscription_plans (name, display_name, display_name_uz, price_monthly, price_6months, price_yearly, features) VALUES
  ('basic', 'Базовый', 'Asosiy', 99000, 495000, 990000, '{"ru": ["HD качество", "1 устройство", "Без рекламы"], "uz": ["HD sifat", "1 qurilma", "Reklamsiz"]}'),
  ('standard', 'Стандарт', 'Standart', 249000, 1245000, 2490000, '{"ru": ["Full HD качество", "2 устройства", "Без рекламы", "Скачивание"], "uz": ["Full HD sifat", "2 qurilma", "Reklamsiz", "Yuklab olish"]}'),
  ('premium', 'Премиум', 'Premium', 449000, 2245000, 4490000, '{"ru": ["4K качество", "4 устройства", "Без рекламы", "Скачивание", "Ранний доступ"], "uz": ["4K sifat", "4 qurilma", "Reklamsiz", "Yuklab olish", "Erta kirish"]}');

-- Sample Movies
INSERT INTO movies (title, title_uz, description, description_uz, type, release_year, duration_minutes, poster_url, backdrop_url, video_url, video_source, is_featured, is_trending, status) VALUES
  ('Оппенгеймер', 'Oppenheimer', 'История американского физика Роберта Оппенгеймера, руководителя Манхэттенского проекта.', 'Amerika fizigi Robert Oppenheimer haqida hikoya, Manhattan loyihasining rahbari.', 'movie', 2023, 180, 'https://picsum.photos/seed/opp/400/600', 'https://picsum.photos/seed/opp-bg/1920/1080', 'https://www.youtube.com/watch?v=uYPbbksJxIg', 'youtube', TRUE, TRUE, 'published'),
  ('Паразиты', 'Parazitlar', 'Семья Ким живет в маленькой грязной квартире и еле сводит концы с концами.', 'Kim oilasi kichik va iflos kvartirada yashaydi va zorg''a tirikchilik qiladi.', 'movie', 2019, 132, 'https://picsum.photos/seed/para/400/600', 'https://picsum.photos/seed/para-bg/1920/1080', 'https://www.youtube.com/watch?v=5xH0HfJHsaY', 'youtube', TRUE, FALSE, 'published'),
  ('Бедные-несчастные', 'Bechora narsalar', 'История невероятного перевоплощения Беллы Бакстер.', 'Bella Baksterning ajoyib o''zgarishi haqida hikoya.', 'movie', 2023, 141, 'https://picsum.photos/seed/poor/400/600', NULL, 'https://www.youtube.com/watch?v=RlbR5N6veqw', 'youtube', FALSE, TRUE, 'published'),
  ('Вонка', 'Vonka', 'История молодого Вилли Вонки и его шоколадной фабрики.', 'Yosh Villi Vonka va uning shokolad fabrikasi haqida hikoya.', 'movie', 2023, 116, 'https://picsum.photos/seed/wonka/400/600', NULL, 'https://www.youtube.com/watch?v=otNh9bTjXWg', 'youtube', FALSE, TRUE, 'published'),
  ('Интерстеллар', 'Interstellar', 'Когда Земля становится непригодной для жизни, исследователи отправляются сквозь червоточину.', 'Yer yashash uchun yaroqsiz bo''lganda, tadqiqotchilar chuvalchang teshigidan o''tadi.', 'movie', 2014, 169, 'https://picsum.photos/seed/inter/400/600', NULL, 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'youtube', FALSE, TRUE, 'published');

-- Sample Series
INSERT INTO movies (title, title_uz, description, description_uz, type, release_year, poster_url, video_source, status) VALUES
  ('Ток шоу с Азизом', 'Aziz bilan tok shou', 'Популярное ток-шоу с интересными гостями и актуальными темами.', 'Qiziqarli mehmonlar va dolzarb mavzular bilan mashhur tok-shou.', 'series', 2024, 'https://picsum.photos/seed/talk1/400/600', 'youtube', 'published');

-- Get series ID for seasons
DO $$
DECLARE
  series_id UUID;
  season1_id UUID;
  season2_id UUID;
BEGIN
  SELECT id INTO series_id FROM movies WHERE title = 'Ток шоу с Азизом' LIMIT 1;
  
  -- Add seasons
  INSERT INTO seasons (movie_id, season_number, title, title_uz) VALUES
    (series_id, 1, 'Сезон 1', '1-mavsum') RETURNING id INTO season1_id;
  INSERT INTO seasons (movie_id, season_number, title, title_uz) VALUES
    (series_id, 2, 'Сезон 2', '2-mavsum') RETURNING id INTO season2_id;
  
  -- Add episodes to season 1
  INSERT INTO episodes (season_id, episode_number, title, title_uz, description, description_uz, duration_minutes, video_url, thumbnail_url) VALUES
    (season1_id, 1, 'Премьера шоу', 'Shou premyerasi', 'Первый выпуск нового ток-шоу.', 'Yangi tok-shouning birinchi soni.', 45, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/ep1/320/180'),
    (season1_id, 2, 'Гость из Голливуда', 'Gollivuddan mehmon', 'Интервью со звездой кино.', 'Kino yulduzi bilan intervyu.', 50, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/ep2/320/180'),
    (season1_id, 3, 'Технологии будущего', 'Kelajak texnologiyalari', 'Обсуждение IT-трендов.', 'IT trendlarini muhokama qilish.', 48, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/ep3/320/180');
  
  -- Add episodes to season 2
  INSERT INTO episodes (season_id, episode_number, title, title_uz, description, description_uz, duration_minutes, video_url, thumbnail_url) VALUES
    (season2_id, 1, 'Новый сезон', 'Yangi mavsum', 'Возвращение шоу с новыми темами.', 'Yangi mavzular bilan shou qaytishi.', 52, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://picsum.photos/seed/ep4/320/180');
END $$;

-- Collections
INSERT INTO collections (name, name_uz, slug, display_order) VALUES
  ('Рекомендуем', 'Tavsiya etamiz', 'recommended', 1),
  ('Новинки', 'Yangiliklar', 'new-releases', 2),
  ('Топ недели', 'Hafta topi', 'top-week', 3);

-- TV Schedule (example for today)
INSERT INTO tv_schedule (program_title, program_title_uz, start_time, end_time, is_live) VALUES
  ('Утренние новости', 'Ertalabki yangiliklar', NOW()::date + '06:00'::time, NOW()::date + '08:00'::time, FALSE),
  ('Ток-шоу "Доброе утро"', 'Tok-shou "Xayrli tong"', NOW()::date + '08:00'::time, NOW()::date + '10:00'::time, FALSE),
  ('Документальный фильм', 'Hujjatli film', NOW()::date + '10:00'::time, NOW()::date + '11:30'::time, FALSE),
  ('Кулинарное шоу', 'Pazandachilik shousi', NOW()::date + '11:30'::time, NOW()::date + '12:30'::time, FALSE),
  ('Дневные новости', 'Kunduzi yangiliklar', NOW()::date + '12:30'::time, NOW()::date + '13:00'::time, FALSE),
  ('Вечерние новости', 'Kechki yangiliklar', NOW()::date + '19:00'::time, NOW()::date + '20:00'::time, FALSE),
  ('Прайм-тайм шоу', 'Praym-taym shousi', NOW()::date + '20:00'::time, NOW()::date + '22:00'::time, FALSE);

-- =====================================================
-- NOTE: Test users must be created via Supabase Auth UI or API
-- After creating users, run this to set admin:
-- UPDATE profiles SET is_admin = TRUE, admin_access = TRUE WHERE email = 'admin@makontv.uz';
-- UPDATE profiles SET admin_access = TRUE WHERE email = 'premium@test.com';
-- =====================================================
