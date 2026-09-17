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
 * O reconhecimento de fala (transcript) vem do VoiceButton (Web Speech API).
 * Aqui o transcript deveria ser enviado para a Claude API para classificar a
 * categoria e extrair os itens estruturados.
 *
 * TODO: criar uma Serverless Function na Vercel (ex: /api/parse) que recebe o
 * transcript, chama a Claude API com a CLAUDE_API_KEY (secreta, só no servidor)
 * e devolve { categoria, confidence, items }. Trocar o parse local abaixo por
 * um fetch para essa função.
 */
export function useVoiceInput(userId?: string) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<VoiceResult | null>(null);

  async function handleVoiceInput(spokenText: string) {
    setTranscript(spokenText);
    setStatus('processing');

    try {
      const claudeResult = parseLocally(spokenText);

      if (userId) {
        try {
          await voiceLogService.logVoiceInput(userId, spokenText, claudeResult);
        } catch (e) {
          console.warn('[useVoiceInput] falha ao logar (ok em dev):', e);
        }
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

/**
 * Parser heurístico simples (placeholder até plugar o Claude).
 * Reconhece um exercício no formato "<nome> <sets>x<reps> [com <peso>kg]".
 */
function parseLocally(text: string): VoiceResult {
  const lower = text.toLowerCase();

  const setsReps = lower.match(/(\d+)\s*[x×]\s*(\d+)/);
  const peso = lower.match(/(\d+(?:[.,]\d+)?)\s*(kg|kgs|quilos?|lbs?)/);

  if (setsReps) {
    const nome = text
      .replace(/(\d+)\s*[x×]\s*(\d+).*/i, '')
      .replace(/\bs[eé]ries?\b|\brepeti[cç][oõ]es?\b|\bde\b/gi, '')
      .trim();
    return {
      categoria: 'treinos',
      confidence: 0.6,
      items: [
        {
          nome: nome || text,
          sets: Number(setsReps[1]),
          reps: Number(setsReps[2]),
          peso: peso ? Number(peso[1].replace(',', '.')) : undefined,
          unidade: peso && /lb/.test(peso[2]) ? 'lbs' : 'kg',
        },
      ],
    };
  }

  // Não reconheceu — devolve como treino não estruturado para o usuário editar.
  return {
    categoria: 'treinos',
    confidence: 0.2,
    items: [{ nome: text }],
  };
}
