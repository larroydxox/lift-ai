import { supabase } from './supabaseClient';

export const voiceLogService = {
  async logVoiceInput(userId: string, transcript: string, claudeResult: any) {
    const { data, error } = await supabase
      .from('voice_logs')
      .insert({
        user_id: userId,
        transcript_original: transcript,
        categoria_detectada: claudeResult?.categoria,
        confidence: claudeResult?.confidence,
        resultado_json: claudeResult,
        foi_confirmado: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async confirmVoiceInput(voiceLogId: string) {
    const { data, error } = await supabase
      .from('voice_logs')
      .update({ foi_confirmado: true })
      .eq('id', voiceLogId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
