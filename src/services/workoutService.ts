import { supabase } from './supabaseClient';

export interface ExerciseInput {
  nome: string;
  sets?: number;
  reps?: number;
  peso?: number;
  unidade?: string;
  tempo_repouso_segundos?: number;
  rpe?: number;
  notas?: string;
}

export const workoutService = {
  // Criar novo workout
  async createWorkout(userId: string, data: string, tipoTreino?: string) {
    const { data: workout, error } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        data,
        tipo_treino: tipoTreino,
      })
      .select()
      .single();

    if (error) throw error;
    return workout;
  },

  // Adicionar um exercício a um workout
  async addExercise(workoutId: string, userId: string, exerciseData: ExerciseInput) {
    const { data: exercise, error } = await supabase
      .from('exercises')
      .insert({
        workout_id: workoutId,
        user_id: userId,
        ...exerciseData,
      })
      .select()
      .single();

    if (error) throw error;
    return exercise;
  },

  // Adicionar múltiplos exercícios de uma vez (voice input)
  async addMultipleExercises(workoutId: string, userId: string, exercises: ExerciseInput[]) {
    const exercisesData = exercises.map((ex, idx) => ({
      workout_id: workoutId,
      user_id: userId,
      nome: ex.nome,
      sets: ex.sets,
      reps: ex.reps,
      peso: ex.peso,
      unidade: ex.unidade || 'kg',
      ordem_no_workout: idx,
    }));

    const { data, error } = await supabase.from('exercises').insert(exercisesData).select();

    if (error) throw error;
    return data;
  },

  // Listar workouts do usuário por data (com exercícios)
  async getWorkoutsByDate(userId: string, data: string) {
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('*, exercises(*)')
      .eq('user_id', userId)
      .eq('data', data)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return workouts;
  },

  // Listar últimos workouts
  async getRecentWorkouts(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('workouts')
      .select('*, exercises(*)')
      .eq('user_id', userId)
      .order('data', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Atualizar exercício
  async updateExercise(exerciseId: string, updates: Partial<ExerciseInput>) {
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar exercício
  async deleteExercise(exerciseId: string) {
    const { error } = await supabase.from('exercises').delete().eq('id', exerciseId);
    if (error) throw error;
  },
};
