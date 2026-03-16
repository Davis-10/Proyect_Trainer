-- FitScience Database Schema
-- Personal Trainer Platform with Plans, Progress Tracking, and User Management

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- ============================================
-- 2. SUBSCRIPTION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration_months INTEGER NOT NULL DEFAULT 1,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO public.plans (name, slug, description, price, duration_months, features, is_popular) VALUES
('Basic', 'basic', 'Ideal para comenzar tu transformacion', 29.99, 1, 
  '["Plan de entrenamiento personalizado", "Acceso a la app movil", "Seguimiento de progreso basico", "Soporte por email"]'::jsonb, 
  false),
('GoUp', 'goup', 'El mas popular para resultados reales', 49.99, 1, 
  '["Todo lo de Basic", "Plan nutricional personalizado", "Analisis de composicion corporal", "Videollamadas mensuales", "Soporte prioritario"]'::jsonb, 
  true),
('Expert', 'expert', 'Entrenamiento de elite para atletas', 79.99, 1, 
  '["Todo lo de GoUp", "Entrenador personal dedicado", "Planes periodizados avanzados", "Analisis biomecanico", "Acceso ilimitado a contenido premium", "Soporte 24/7"]'::jsonb, 
  false)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 4. PHYSICAL STATS TABLE (for tracking body metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.physical_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5, 2),
  height_cm DECIMAL(5, 2),
  body_fat_percentage DECIMAL(4, 2),
  muscle_mass_kg DECIMAL(5, 2),
  waist_cm DECIMAL(5, 2),
  chest_cm DECIMAL(5, 2),
  arm_cm DECIMAL(5, 2),
  thigh_cm DECIMAL(5, 2),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE public.physical_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "physical_stats_select_own" ON public.physical_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "physical_stats_insert_own" ON public.physical_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "physical_stats_update_own" ON public.physical_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "physical_stats_delete_own" ON public.physical_stats FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. FITNESS GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.fitness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility', 'general_fitness')),
  target_value DECIMAL(10, 2),
  target_unit TEXT,
  current_value DECIMAL(10, 2),
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fitness_goals_select_own" ON public.fitness_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fitness_goals_insert_own" ON public.fitness_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fitness_goals_update_own" ON public.fitness_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "fitness_goals_delete_own" ON public.fitness_goals FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. WORKOUT PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER,
  days_per_week INTEGER,
  focus_area TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_plans_select_own" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workout_plans_insert_own" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_plans_update_own" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "workout_plans_delete_own" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 7. EXERCISES TABLE (library of exercises)
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  video_url TEXT,
  image_url TEXT,
  instructions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow all authenticated users to read exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_select_all" ON public.exercises FOR SELECT TO authenticated USING (true);

-- ============================================
-- 8. WORKOUT SESSIONS TABLE (completed workouts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES public.workout_plans(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_sessions_select_own" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workout_sessions_insert_own" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sessions_update_own" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "workout_sessions_delete_own" ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 9. TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 10. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fitness_goals_updated_at BEFORE UPDATE ON public.fitness_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 11. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_physical_stats_user_id ON public.physical_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_physical_stats_recorded_at ON public.physical_stats(recorded_at);
CREATE INDEX IF NOT EXISTS idx_fitness_goals_user_id ON public.fitness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON public.workout_sessions(date);
