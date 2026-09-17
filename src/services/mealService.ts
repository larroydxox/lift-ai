import { supabase } from './supabaseClient';

export interface MealInput {
  tipo_refeicao: string;
  alimento: string;
  quantidade?: number;
  unidade?: string;
  calorias_estimadas?: number;
  proteina_g?: number;
  carboidratos_g?: number;
  gordura_g?: number;
}

export const mealService = {
  async addMeal(userId: string, data: string, mealData: MealInput) {
    const { data: meal, error } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        data,
        ...mealData,
      })
      .select()
      .single();

    if (error) throw error;
    return meal;
  },

  async addMultipleMeals(userId: string, data: string, meals: MealInput[]) {
    const mealsData = meals.map((meal) => ({
      user_id: userId,
      data,
      ...meal,
    }));

    const { data: insertedMeals, error } = await supabase.from('meals').insert(mealsData).select();

    if (error) throw error;
    return insertedMeals;
  },

  async getMealsByDate(userId: string, data: string) {
    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('data', data)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return meals;
  },

  async getTotalCaloriesForDay(userId: string, data: string) {
    const { data: meals, error } = await supabase
      .from('meals')
      .select('calorias_estimadas')
      .eq('user_id', userId)
      .eq('data', data);

    if (error) throw error;

    const total = meals?.reduce((sum, meal) => sum + (meal.calorias_estimadas || 0), 0) || 0;
    return total;
  },
};
