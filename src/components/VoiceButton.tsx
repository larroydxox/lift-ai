import { useEffect, useRef, useState } from 'react';

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  onStatusChange?: (status: string) => void;
}

/**
 * Botão de gravação por voz usando a Web Speech API (webkitSpeechRecognition).
 * Funciona no Chrome (desktop e Android). No iOS Safari o suporte é limitado —
 * há um fallback de digitação via prompt().
 */
export function VoiceButton({ onResult, onStatusChange }: VoiceButtonProps) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onerror = () => {
      setRecording(false);
      onStatusChange?.('error');
    };
    recognition.onend = () => {
      setRecording(false);
      onStatusChange?.('idle');
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.abort();
      } catch {
        /* noop */
      }
    };
  }, [onResult, onStatusChange]);

  function handlePress() {
    if (!supported) {
      // Fallback: digitação manual quando não há reconhecimento de voz.
      const text = window.prompt('Digite o que você fez (ex: "supino 3x10 com 40kg"):');
      if (text) onResult(text);
      return;
    }
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      onStatusChange?.('idle');
    } else {
      try {
        recognitionRef.current?.start();
        setRecording(true);
        onStatusChange?.('listening');
      } catch {
        /* já iniciado */
      }
    }
  }

  return (
    <button
      onClick={handlePress}
      aria-label={recording ? 'Parar gravação' : 'Gravar por voz'}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: 'none',
        background: recording ? '#d94f1e' : 'var(--accent)',
        color: '#fff',
        fontSize: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(255,107,53,0.45)',
        transition: 'transform 0.1s ease',
      }}
    >
      {recording ? '■' : '🎤'}
    </button>
  );
}
