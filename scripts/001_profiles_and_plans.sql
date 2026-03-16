-- 1. PROFILES TABLE
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

-- 2. PLANS TABLE
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
