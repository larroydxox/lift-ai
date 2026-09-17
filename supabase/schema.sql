-- LIFT AI — Schema PostgreSQL para Supabase
-- Cole este arquivo inteiro no SQL Editor do Supabase e rode.

-- Extensões necessárias
create extension if not exists "uuid-ossp";

-- Tabela de usuários (estendendo auth.users do Supabase)
create table public.users (
  id uuid not null references auth.users(id) on delete cascade,
  username text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  objetivo text, -- "ganho_massa", "perda_peso", "manutenção"
  idade integer,
  sexo text,
  altura_cm decimal,
  peso_inicial_kg decimal,
  primary key (id)
);

-- Tabela de workouts/treinos
create table public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  data date not null,
  tipo_treino text, -- "Push", "Pull", "Legs", "Full Body"
  duracao_minutos integer,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de exercícios realizados
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  nome text not null,
  sets integer,
  reps integer,
  peso decimal,
  unidade text, -- "lbs", "kg"
  tempo_repouso_segundos integer,
  rpe integer, -- Rate of Perceived Exertion (1-10)
  notas text,
  ordem_no_workout integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de alimentos/nutrição
create table public.meals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  data date not null,
  tipo_refeicao text, -- "breakfast", "lunch", "dinner", "snack"
  alimento text not null,
  quantidade decimal,
  unidade text, -- "g", "ml", "unidade"
  calorias_estimadas decimal,
  proteina_g decimal,
  carboidratos_g decimal,
  gordura_g decimal,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de métricas (peso, medidas)
create table public.metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  data_medicao date not null,
  tipo text, -- "peso_corporal", "medida_cintura", "medida_braço", etc
  valor decimal not null,
  unidade text, -- "kg", "lbs", "cm", "in"
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de atividades (passos, corrida, etc)
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  data date not null,
  tipo text, -- "caminhada", "corrida", "bike", "natação"
  distancia decimal,
  unidade_distancia text, -- "km", "mi"
  duracao_minutos integer,
  calorias_queimadas decimal,
  fonte text, -- "manual", "healthkit", "google_fit"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de voice inputs (para log/debug)
create table public.voice_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  transcript_original text not null,
  categoria_detectada text,
  confidence decimal,
  resultado_json jsonb, -- JSON da resposta do Claude
  foi_confirmado boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para performance
create index idx_workouts_user_id on public.workouts(user_id);
create index idx_workouts_data on public.workouts(data);
create index idx_exercises_workout_id on public.exercises(workout_id);
create index idx_exercises_user_id on public.exercises(user_id);
create index idx_meals_user_id on public.meals(user_id);
create index idx_meals_data on public.meals(data);
create index idx_metrics_user_id on public.metrics(user_id);
create index idx_activities_user_id on public.activities(user_id);
create index idx_voice_logs_user_id on public.voice_logs(user_id);

-- Row Level Security (RLS) - Cada usuário só vê seus dados
alter table public.users enable row level security;
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;
alter table public.meals enable row level security;
alter table public.metrics enable row level security;
alter table public.activities enable row level security;
alter table public.voice_logs enable row level security;

-- Policies para users
create policy "Users can view their own data"
  on public.users for select using (auth.uid() = id);
create policy "Users can insert their own data"
  on public.users for insert with check (auth.uid() = id);
create policy "Users can update their own data"
  on public.users for update using (auth.uid() = id);

-- Policies para workouts
create policy "Users can view their own workouts"
  on public.workouts for select using (auth.uid() = user_id);
create policy "Users can create workouts"
  on public.workouts for insert with check (auth.uid() = user_id);
create policy "Users can update their own workouts"
  on public.workouts for update using (auth.uid() = user_id);
create policy "Users can delete their own workouts"
  on public.workouts for delete using (auth.uid() = user_id);

-- Policies para exercises
create policy "Users can view their own exercises"
  on public.exercises for select using (auth.uid() = user_id);
create policy "Users can insert exercises"
  on public.exercises for insert with check (auth.uid() = user_id);
create policy "Users can update their own exercises"
  on public.exercises for update using (auth.uid() = user_id);
create policy "Users can delete their own exercises"
  on public.exercises for delete using (auth.uid() = user_id);

-- Policies para meals
create policy "Users can view their own meals"
  on public.meals for select using (auth.uid() = user_id);
create policy "Users can insert meals"
  on public.meals for insert with check (auth.uid() = user_id);
create policy "Users can update their own meals"
  on public.meals for update using (auth.uid() = user_id);
create policy "Users can delete their own meals"
  on public.meals for delete using (auth.uid() = user_id);

-- Policies para metrics
create policy "Users can view their own metrics"
  on public.metrics for select using (auth.uid() = user_id);
create policy "Users can insert metrics"
  on public.metrics for insert with check (auth.uid() = user_id);
create policy "Users can update their own metrics"
  on public.metrics for update using (auth.uid() = user_id);

-- Policies para activities
create policy "Users can view their own activities"
  on public.activities for select using (auth.uid() = user_id);
create policy "Users can insert activities"
  on public.activities for insert with check (auth.uid() = user_id);
create policy "Users can update their own activities"
  on public.activities for update using (auth.uid() = user_id);

-- Policies para voice_logs
create policy "Users can view their own voice logs"
  on public.voice_logs for select using (auth.uid() = user_id);
create policy "Users can insert voice logs"
  on public.voice_logs for insert with check (auth.uid() = user_id);
create policy "Users can update their own voice logs"
  on public.voice_logs for update using (auth.uid() = user_id);
