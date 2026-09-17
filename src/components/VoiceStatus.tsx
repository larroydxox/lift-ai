import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VoiceStatusProps {
  status: string;
  message?: string;
}

const LABELS: Record<string, string> = {
  listening: 'Ouvindo…',
  processing: 'Processando…',
  confirming: 'Confirme os itens',
  error: 'Algo deu errado',
};

export const VoiceStatus: React.FC<VoiceStatusProps> = ({ status, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.status}>{LABELS[status] || status}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  status: {
    color: '#FF6B35',
    fontSize: 13,
    fontWeight: '600',
  },
  message: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});
