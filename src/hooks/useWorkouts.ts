import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { workoutService, ExerciseInput } from '../services/workoutService';

interface Workout {
  id: string;
  data: string;
  tipo_treino: string | null;
  exercises: any[];
}

export function useWorkouts(userId?: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const data = await workoutService.getWorkoutsByDate(userId, today);
      setWorkouts((data as Workout[]) || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    loadWorkouts();

    // Realtime (supabase-js v2): assina mudanças da tabela workouts do usuário
    const channel = supabase
      .channel(`workouts:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workouts', filter: `user_id=eq.${userId}` },
        () => {
          loadWorkouts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadWorkouts]);

  async function addExercises(exercises: ExerciseInput[]) {
    if (!userId) return;
    try {
      let workout = workouts[0];
      if (!workout) {
        const today = new Date().toISOString().split('T')[0];
        workout = (await workoutService.createWorkout(userId, today)) as Workout;
      }
      await workoutService.addMultipleExercises(workout.id, userId, exercises);
      await loadWorkouts();
    } catch (err) {
      setError(String(err));
      throw err;
    }
  }

  return {
    workouts,
    loading,
    error,
    addExercises,
    refreshWorkouts: loadWorkouts,
  };
}
