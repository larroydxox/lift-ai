import { supabase } from './supabaseClient';

export interface MetricInput {
  tipo: string; // "peso_corporal", "medida_cintura", ...
  valor: number;
  unidade: string; // "kg", "lbs", "cm", "in"
  notas?: string;
  data_medicao?: string; // default: hoje
}

export const metricService = {
  async addMetric(userId: string, metricData: MetricInput) {
    const { data_medicao, ...rest } = metricData;
    const { data: metric, error } = await supabase
      .from('metrics')
      .insert({
        user_id: userId,
        data_medicao: data_medicao || new Date().toISOString().split('T')[0],
        ...rest,
      })
      .select()
      .single();

    if (error) throw error;
    return metric;
  },

  async getMetricsByType(userId: string, tipo: string) {
    const { data: metrics, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('tipo', tipo)
      .order('data_medicao', { ascending: false });

    if (error) throw error;
    return metrics;
  },

  async getLatestWeight(userId: string) {
    const { data, error } = await supabase
      .from('metrics')
      .select('valor, data_medicao')
      .eq('user_id', userId)
      .eq('tipo', 'peso_corporal')
      .order('data_medicao', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
