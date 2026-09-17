import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabaseClient] REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY não definidos. ' +
      'Copie .env.example para .env e preencha as chaves.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string | null;
          email: string;
          created_at: string;
          objetivo: string | null;
          idade: number | null;
          sexo: string | null;
          altura_cm: number | null;
          peso_inicial_kg: number | null;
        };
        Insert: {
          id: string;
          username?: string;
          email: string;
          objetivo?: string;
          idade?: number;
          sexo?: string;
          altura_cm?: number;
          peso_inicial_kg?: number;
        };
        Update: {
          username?: string;
          objetivo?: string;
          idade?: number;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          data: string;
          tipo_treino: string | null;
          duracao_minutos: number | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data: string;
          tipo_treino?: string;
          duracao_minutos?: number;
          notas?: string;
        };
        Update: {
          tipo_treino?: string;
          duracao_minutos?: number;
          notas?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          workout_id: string;
          user_id: string;
          nome: string;
          sets: number | null;
          reps: number | null;
          peso: number | null;
          unidade: string | null;
          tempo_repouso_segundos: number | null;
          rpe: number | null;
          notas: string | null;
          ordem_no_workout: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          workout_id: string;
          user_id: string;
          nome: string;
          sets?: number;
          reps?: number;
          peso?: number;
          unidade?: string;
          tempo_repouso_segundos?: number;
          rpe?: number;
          notas?: string;
          ordem_no_workout?: number;
        };
        Update: {
          nome?: string;
          sets?: number;
          reps?: number;
          peso?: number;
          unidade?: string;
          rpe?: number;
          notas?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          data: string;
          tipo_refeicao: string;
          alimento: string;
          quantidade: number | null;
          unidade: string | null;
          calorias_estimadas: number | null;
          proteina_g: number | null;
          carboidratos_g: number | null;
          gordura_g: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data: string;
          tipo_refeicao: string;
          alimento: string;
          quantidade?: number;
          unidade?: string;
          calorias_estimadas?: number;
          proteina_g?: number;
          carboidratos_g?: number;
          gordura_g?: number;
        };
        Update: {
          alimento?: string;
          quantidade?: number;
          calorias_estimadas?: number;
        };
      };
      metrics: {
        Row: {
          id: string;
          user_id: string;
          data_medicao: string;
          tipo: string;
          valor: number;
          unidade: string;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data_medicao: string;
          tipo: string;
          valor: number;
          unidade: string;
          notas?: string;
        };
        Update: {
          valor?: number;
          notas?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          data: string;
          tipo: string;
          distancia: number | null;
          unidade_distancia: string | null;
          duracao_minutos: number | null;
          calorias_queimadas: number | null;
          fonte: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data: string;
          tipo: string;
          distancia?: number;
          unidade_distancia?: string;
          duracao_minutos?: number;
          calorias_queimadas?: number;
          fonte: string;
        };
        Update: {
          distancia?: number;
          duracao_minutos?: number;
          calorias_queimadas?: number;
        };
      };
      voice_logs: {
        Row: {
          id: string;
          user_id: string;
          transcript_original: string;
          categoria_detectada: string | null;
          confidence: number | null;
          resultado_json: any;
          foi_confirmado: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          transcript_original: string;
          categoria_detectada?: string;
          confidence?: number;
          resultado_json?: any;
          foi_confirmado?: boolean;
        };
      };
    };
  };
};
