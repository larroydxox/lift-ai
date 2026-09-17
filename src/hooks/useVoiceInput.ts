import { useState } from 'react';
import { voiceLogService } from '../services/voiceLogService';

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'confirming' | 'error';

export interface VoiceResult {
  categoria: 'treinos' | 'alimentacao' | 'metricas' | 'atividades' | string;
  confidence: number;
  items: any[];
}

/**
 * Hook de entrada por voz.
 *
 * TODO: Integrar de fato:
 *  1. Reconhecimento de fala (@react-native-voice/voice) -> transcript.
 *  2. Enviar o transcript para a Claude API (via backend/edge function, NUNCA
 *     com a chave embutida no app) para classificar categoria + extrair items.
 *  3. Preencher `result` e mudar `status` para 'confirming'.
 *
 * Este stub deixa a interface pronta para a HomeScreen consumir.
 */
export function useVoiceInput(userId?: string) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<VoiceResult | null>(null);

  async function handleVoiceInput(spokenText: string) {
    setTranscript(spokenText);
    setStatus('processing');

    try {
      // TODO: chamar a Claude API aqui e substituir o mock abaixo.
      const claudeResult: VoiceResult = {
        categoria: 'treinos',
        confidence: 0,
        items: [],
      };

      if (userId) {
        await voiceLogService.logVoiceInput(userId, spokenText, claudeResult);
      }

      setResult(claudeResult);
      setStatus('confirming');
    } catch (err) {
      console.error('[useVoiceInput] erro ao processar:', err);
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setTranscript('');
    setResult(null);
  }

  return { status, transcript, result, handleVoiceInput, reset };
}
