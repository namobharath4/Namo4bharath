-- ============================================================================
-- YUKTI PLATFORM - SUPABASE DATABASE SCHEMA
-- Three-Role Architecture: Farmer, Company, Skilled Worker (+ Admin)
-- Includes Row Level Security (RLS) policies and initial seeds
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
CREATE TYPE user_role AS ENUM ('farmer', 'company', 'skilled_worker', 'admin');

-- 3. Base Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'farmer',
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  state TEXT DEFAULT 'Andhra Pradesh',
  district TEXT DEFAULT 'Guntur',
  village TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Farmer Specific Profiles
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  farm_name TEXT,
  farm_size_acres NUMERIC(6,2) DEFAULT 5.0,
  primary_crops TEXT[] DEFAULT ARRAY['Paddy', 'Chilli', 'Cotton'],
  soil_type TEXT DEFAULT 'Black Cotton',
  irrigation_source TEXT DEFAULT 'Borewell & Canal',
  current_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Company Specific Profiles
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  license_number TEXT,
  company_type TEXT DEFAULT 'Agrochemicals & Fertilizers',
  contact_person TEXT,
  website TEXT,
  verified_status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skilled Worker + Tools Profiles
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT ARRAY['Tractor Operator'],
  years_experience INT DEFAULT 3,
  daily_rate NUMERIC(10,2) DEFAULT 800.00,
  hourly_rate NUMERIC(10,2) DEFAULT 120.00,
  service_type TEXT DEFAULT 'skill_and_tool', -- 'skill_only', 'tool_only', 'skill_and_tool'
  tools_owned TEXT[] DEFAULT ARRAY['Tractor', 'Rotavator'],
  service_radius_km INT DEFAULT 25,
  rating NUMERIC(3,2) DEFAULT 4.8,
  review_count INT DEFAULT 12,
  completed_jobs_count INT DEFAULT 24,
  availability_status TEXT DEFAULT 'available', -- 'available', 'busy', 'offline'
  languages TEXT[] DEFAULT ARRAY['Telugu', 'English', 'Hindi'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Jobs / Work Postings
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poster_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  poster_role user_role NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  crop TEXT,
  location TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  required_equipment TEXT[],
  workers_needed INT DEFAULT 1,
  budget NUMERIC(10,2) NOT NULL,
  rate_type TEXT DEFAULT 'per_day', -- 'per_day', 'per_acre', 'fixed'
  duration_days INT DEFAULT 2,
  urgency TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'emergency'
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'APPLIED', 'SHORTLISTED', 'ACCEPTED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  pitch TEXT,
  proposed_rate NUMERIC(10,2),
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Equipment & Machinery Listings
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Tractor', 'Harvester', 'Sprayer', 'Rotavator', 'Pump'
  model_year INT DEFAULT 2023,
  daily_rate NUMERIC(10,2) NOT NULL,
  weekly_rate NUMERIC(10,2),
  operator_included BOOLEAN DEFAULT true,
  condition TEXT DEFAULT 'Excellent',
  location TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Equipment Rental Requests
CREATE TABLE IF NOT EXISTS public.equipment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  days_needed INT DEFAULT 3,
  start_date DATE,
  total_amount NUMERIC(10,2),
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Messaging System
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant1_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  last_message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self write
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Farmer Profiles: Public read, farmer self write
CREATE POLICY "Farmer profiles viewable by everyone" ON public.farmer_profiles FOR SELECT USING (true);
CREATE POLICY "Farmers can update own profile" ON public.farmer_profiles FOR ALL USING (auth.uid() = user_id);

-- Company Profiles: Public read, company self write
CREATE POLICY "Company profiles viewable by everyone" ON public.company_profiles FOR SELECT USING (true);
CREATE POLICY "Companies can update own profile" ON public.company_profiles FOR ALL USING (auth.uid() = user_id);

-- Worker Profiles: Public read, worker self write
CREATE POLICY "Worker profiles viewable by everyone" ON public.worker_profiles FOR SELECT USING (true);
CREATE POLICY "Workers can update own profile" ON public.worker_profiles FOR ALL USING (auth.uid() = user_id);

-- Jobs: Public read open jobs, author can manage
CREATE POLICY "Jobs viewable by authenticated users" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Users can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = poster_id);
CREATE POLICY "Poster can update own job" ON public.jobs FOR UPDATE USING (auth.uid() = poster_id);

-- Equipment: Public read, owner manage
CREATE POLICY "Equipment viewable by all" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Owner can manage equipment" ON public.equipment FOR ALL USING (auth.uid() = owner_id);

-- Messages: Only participants can read/send
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
