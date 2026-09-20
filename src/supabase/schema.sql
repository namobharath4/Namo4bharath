-- ============================================================================
-- YUKTI PLATFORM - SUPABASE DATABASE SCHEMA
-- Three-Role Agricultural Architecture: Farmer, Agribusiness/Company, Skilled Worker
-- Fully configured with Row Level Security (RLS) policies using auth.uid()
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('farmer', 'company', 'skilled_worker', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Base Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'farmer',
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  state TEXT DEFAULT 'Andhra Pradesh',
  district TEXT DEFAULT 'Guntur',
  village TEXT,
  location TEXT DEFAULT 'Guntur, Andhra Pradesh',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Farmer Specific Profiles
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_name TEXT,
  farm_size_acres NUMERIC(6,2) DEFAULT 5.0,
  primary_crops TEXT[] DEFAULT ARRAY['Paddy', 'Chilli', 'Cotton'],
  soil_type TEXT DEFAULT 'Black Cotton Alluvial',
  irrigation_source TEXT DEFAULT 'Borewell & Canal',
  location TEXT,
  current_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Company Specific Profiles
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  license_number TEXT,
  company_type TEXT DEFAULT 'Agrochemicals & Fertilizers',
  contact_person TEXT,
  website TEXT,
  location TEXT,
  verified_status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skilled Worker + Machinery Operator Profiles
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT ARRAY['Tractor Operator', 'Rotavator Specialist'],
  years_experience INT DEFAULT 3,
  daily_rate NUMERIC(10,2) DEFAULT 1800.00,
  hourly_rate NUMERIC(10,2) DEFAULT 250.00,
  service_type TEXT DEFAULT 'skill_and_tool',
  tools_owned TEXT[] DEFAULT ARRAY['Tractor', 'Rotavator'],
  service_radius_km INT DEFAULT 25,
  rating NUMERIC(3,2) DEFAULT 4.8,
  review_count INT DEFAULT 12,
  completed_jobs_count INT DEFAULT 24,
  availability_status TEXT DEFAULT 'available',
  languages TEXT[] DEFAULT ARRAY['Telugu', 'English', 'Hindi'],
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Jobs / Agricultural Requirements Postings
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poster_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  poster_name TEXT,
  poster_role user_role NOT NULL DEFAULT 'farmer',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  crop TEXT,
  location TEXT NOT NULL,
  required_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  required_equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
  workers_needed INT DEFAULT 1,
  budget NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  rate_type TEXT DEFAULT 'per_day',
  duration_days INT DEFAULT 2,
  urgency TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'OPEN',
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_name TEXT,
  pitch TEXT,
  proposed_rate NUMERIC(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Equipment & Machinery Fleet Listings
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tractor',
  model_year INT DEFAULT 2023,
  specs TEXT,
  daily_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  weekly_rate NUMERIC(10,2),
  operator_included BOOLEAN DEFAULT true,
  condition TEXT DEFAULT 'Excellent',
  location TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Direct Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT,
  content TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications System
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only insert, update, or delete rows belonging to them (auth.uid())
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" 
  ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- FARMER PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Farmer profiles viewable by everyone" ON public.farmer_profiles;
CREATE POLICY "Farmer profiles viewable by everyone" 
  ON public.farmer_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Farmers can insert own profile" ON public.farmer_profiles;
CREATE POLICY "Farmers can insert own profile" 
  ON public.farmer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can update own profile" ON public.farmer_profiles;
CREATE POLICY "Farmers can update own profile" 
  ON public.farmer_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can delete own profile" ON public.farmer_profiles;
CREATE POLICY "Farmers can delete own profile" 
  ON public.farmer_profiles FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- COMPANY PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Company profiles viewable by everyone" ON public.company_profiles;
CREATE POLICY "Company profiles viewable by everyone" 
  ON public.company_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Companies can insert own profile" ON public.company_profiles;
CREATE POLICY "Companies can insert own profile" 
  ON public.company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Companies can update own profile" ON public.company_profiles;
CREATE POLICY "Companies can update own profile" 
  ON public.company_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Companies can delete own profile" ON public.company_profiles;
CREATE POLICY "Companies can delete own profile" 
  ON public.company_profiles FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- WORKER PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Worker profiles viewable by everyone" ON public.worker_profiles;
CREATE POLICY "Worker profiles viewable by everyone" 
  ON public.worker_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Workers can insert own profile" ON public.worker_profiles;
CREATE POLICY "Workers can insert own profile" 
  ON public.worker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Workers can update own profile" ON public.worker_profiles;
CREATE POLICY "Workers can update own profile" 
  ON public.worker_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Workers can delete own profile" ON public.worker_profiles;
CREATE POLICY "Workers can delete own profile" 
  ON public.worker_profiles FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- JOBS POLICIES (CRUD)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Jobs viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs viewable by everyone" 
  ON public.jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create jobs" ON public.jobs;
CREATE POLICY "Authenticated users can create jobs" 
  ON public.jobs FOR INSERT WITH CHECK (auth.uid() = poster_id);

DROP POLICY IF EXISTS "Posters can update own jobs" ON public.jobs;
CREATE POLICY "Posters can update own jobs" 
  ON public.jobs FOR UPDATE USING (auth.uid() = poster_id) WITH CHECK (auth.uid() = poster_id);

DROP POLICY IF EXISTS "Posters can delete own jobs" ON public.jobs;
CREATE POLICY "Posters can delete own jobs" 
  ON public.jobs FOR DELETE USING (auth.uid() = poster_id);

-- ----------------------------------------------------------------------------
-- JOB APPLICATIONS POLICIES (CRUD)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "View job applications" ON public.job_applications;
CREATE POLICY "View job applications" 
  ON public.job_applications FOR SELECT 
  USING (
    auth.uid() = worker_id OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.poster_id = auth.uid())
  );

DROP POLICY IF EXISTS "Workers can apply for jobs" ON public.job_applications;
CREATE POLICY "Workers can apply for jobs" 
  ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = worker_id);

DROP POLICY IF EXISTS "Manage job application status" ON public.job_applications;
CREATE POLICY "Manage job application status" 
  ON public.job_applications FOR UPDATE 
  USING (
    auth.uid() = worker_id OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.poster_id = auth.uid())
  );

DROP POLICY IF EXISTS "Workers can withdraw applications" ON public.job_applications;
CREATE POLICY "Workers can withdraw applications" 
  ON public.job_applications FOR DELETE USING (auth.uid() = worker_id);

-- ----------------------------------------------------------------------------
-- EQUIPMENT FLEET POLICIES (CRUD)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Equipment listings viewable by everyone" ON public.equipment;
CREATE POLICY "Equipment listings viewable by everyone" 
  ON public.equipment FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can list equipment" ON public.equipment;
CREATE POLICY "Owners can list equipment" 
  ON public.equipment FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update own equipment" ON public.equipment;
CREATE POLICY "Owners can update own equipment" 
  ON public.equipment FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete own equipment" ON public.equipment;
CREATE POLICY "Owners can delete own equipment" 
  ON public.equipment FOR DELETE USING (auth.uid() = owner_id);

-- ----------------------------------------------------------------------------
-- MESSAGES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Participants can view conversation messages" ON public.messages;
CREATE POLICY "Participants can view conversation messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Recipients can update message status" ON public.messages;
CREATE POLICY "Recipients can update message status" 
  ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Senders can delete messages" ON public.messages;
CREATE POLICY "Senders can delete messages" 
  ON public.messages FOR DELETE USING (auth.uid() = sender_id);

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Notifications can be created for users" ON public.notifications;
CREATE POLICY "Notifications can be created for users" 
  ON public.notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" 
  ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- REVIEWS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can submit reviews" ON public.reviews;
CREATE POLICY "Users can submit reviews" 
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Reviewers can update own reviews" ON public.reviews;
CREATE POLICY "Reviewers can update own reviews" 
  ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Reviewers can delete own reviews" ON public.reviews;
CREATE POLICY "Reviewers can delete own reviews" 
  ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- ============================================================================
-- 12. SUPABASE STORAGE POLICIES FOR PRIVATE BUCKET "app-files"
-- Structure: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${ext}
-- ============================================================================
-- Ensure private bucket exists:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-files', 'app-files', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload files into their own folder (${auth.uid()}/*)
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
CREATE POLICY "Users can upload to own folder" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'app-files' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Authenticated users can view/download files in their own folder
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
CREATE POLICY "Users can view own files" 
  ON storage.objects FOR SELECT 
  TO authenticated 
  USING (
    bucket_id = 'app-files' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Authenticated users can update files in their own folder
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (
    bucket_id = 'app-files' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Authenticated users can delete files in their own folder
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (
    bucket_id = 'app-files' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

