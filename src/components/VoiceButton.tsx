import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  onStatusChange?: (status: string) => void;
}

/**
 * Botão de gravação por voz.
 *
 * TODO: Ligar ao @react-native-voice/voice (Voice.start / Voice.onSpeechResults)
 * e chamar onResult com o transcript final. Este stub apenas dispara um texto
 * de exemplo para o fluxo poder ser testado.
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({ onResult, onStatusChange }) => {
  const [recording, setRecording] = useState(false);

  function handlePress() {
    if (recording) {
      setRecording(false);
      onStatusChange?.('idle');
      // Stub: substituir pelo transcript real do reconhecimento de fala.
      onResult('supino reto 3 séries de 10 com 40 kg');
    } else {
      setRecording(true);
      onStatusChange?.('listening');
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, recording && styles.buttonActive]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{recording ? '■' : '🎤'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonActive: {
    backgroundColor: '#d94f1e',
  },
  icon: {
    fontSize: 28,
    color: '#fff',
  },
});
