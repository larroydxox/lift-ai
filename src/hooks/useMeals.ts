import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { mealService, MealInput } from '../services/mealService';

export function useMeals(userId?: string) {
  const [meals, setMeals] = useState<any[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadMeals = useCallback(async () => {
    if (!userId) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await mealService.getMealsByDate(userId, today);
      setMeals(data || []);

      const calories = await mealService.getTotalCaloriesForDay(userId, today);
      setTotalCalories(calories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    loadMeals();

    // Realtime (supabase-js v2)
    const channel = supabase
      .channel(`meals:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'meals', filter: `user_id=eq.${userId}` },
        () => {
          loadMeals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadMeals]);

  async function addMeal(mealData: MealInput) {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    await mealService.addMeal(userId, today, mealData);
    await loadMeals();
  }

  return {
    meals,
    totalCalories,
    loading,
    addMeal,
    refreshMeals: loadMeals,
  };
}
