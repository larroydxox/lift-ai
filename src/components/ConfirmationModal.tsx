import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { VoiceResult } from '../hooks/useVoiceInput';

interface ConfirmationModalProps {
  result: VoiceResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  result,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent visible animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Confirmar</Text>
          <Text style={styles.subtitle}>
            {result?.categoria} · {result?.items?.length ?? 0} item(ns)
          </Text>

          <ScrollView style={styles.list}>
            {result?.items?.map((item, idx) => (
              <View key={idx} style={styles.item}>
                <Text style={styles.itemText}>{item.nome || item.alimento || JSON.stringify(item)}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '600' },
  subtitle: { color: '#888', fontSize: 13, marginTop: 4, marginBottom: 12 },
  list: { marginBottom: 16 },
  item: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemText: { color: '#fff', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  cancel: { backgroundColor: '#2a2a2a' },
  confirm: { backgroundColor: '#FF6B35' },
  cancelText: { color: '#fff', fontWeight: '600' },
  confirmText: { color: '#fff', fontWeight: '600' },
});
