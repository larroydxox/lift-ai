import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { authService } from '../services/authService';
import { VoiceButton } from '../components/VoiceButton';
import { VoiceStatus } from '../components/VoiceStatus';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useWorkouts } from '../hooks/useWorkouts';
import { useMeals } from '../hooks/useMeals';

export const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const voice = useVoiceInput(user?.id);
  const workouts = useWorkouts(user?.id);
  const meals = useMeals(user?.id);

  useEffect(() => {
    authService.getCurrentUser().then(setUser).catch(() => setUser(null));
    const unsubscribe = authService.onAuthStateChange((u) => setUser(u));
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (voice.status === 'confirming') {
      setShowConfirmation(true);
    }
  }, [voice.status]);

  const handleConfirm = async () => {
    try {
      if (!voice.result) return;
      if (voice.result.categoria === 'treinos') {
        await workouts.addExercises(voice.result.items);
      } else if (voice.result.categoria === 'alimentacao') {
        if (voice.result.items[0]) await meals.addMeal(voice.result.items[0]);
      }
      // TODO: métricas, atividades

      setShowConfirmation(false);
      voice.reset();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.title}>Please log in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>TODAY</Text>
          <TouchableOpacity onPress={() => authService.signOut()}>
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Workouts</Text>
          {workouts.loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            workouts.workouts.map((wo) => (
              <View key={wo.id} style={styles.card}>
                <Text style={styles.cardTitle}>{wo.tipo_treino || 'Workout'}</Text>
                <Text style={styles.cardText}>{wo.exercises.length} exercises</Text>
              </View>
            ))
          )}
        </View>

        {/* Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍔 Nutrition</Text>
          <View style={styles.calorieCard}>
            <Text style={styles.calorieValue}>{Math.round(meals.totalCalories)}</Text>
            <Text style={styles.calorieLabel}>calories / 2000</Text>
          </View>
          {meals.meals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <Text style={styles.mealName}>{meal.alimento}</Text>
              <Text style={styles.mealCal}>{meal.calorias_estimadas} cal</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Voice Button */}
      <View style={styles.voiceButtonContainer}>
        <VoiceButton onResult={voice.handleVoiceInput} />
      </View>

      {/* Status */}
      {voice.status !== 'idle' && <VoiceStatus status={voice.status} message={voice.transcript} />}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          result={voice.result}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '600', color: '#fff' },
  logoutButton: { color: '#FF6B35', fontSize: 14, fontWeight: '600' },
  section: { marginHorizontal: 16, marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8 },
  cardText: { fontSize: 13, color: '#888' },
  calorieCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  calorieValue: { fontSize: 32, fontWeight: '600', color: '#fff' },
  calorieLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mealName: { color: '#fff', fontSize: 14 },
  mealCal: { color: '#888', fontSize: 13 },
  loadingText: { color: '#888', fontSize: 14 },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
