import { useEffect, useState } from 'react';
import { VoiceButton } from '../components/VoiceButton';
import { VoiceStatus } from '../components/VoiceStatus';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useWorkouts } from '../hooks/useWorkouts';
import { useMeals } from '../hooks/useMeals';

export function HomeScreen() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sem autenticação por enquanto — userId indefinido. Os hooks/services só
  // carregam/salvam dados quando houver um userId (o RLS do Supabase exige um
  // usuário). Quando você quiser, a gente pluga auth de volta.
  const userId = undefined;
  const voice = useVoiceInput(userId);
  const workouts = useWorkouts(userId);
  const meals = useMeals(userId);

  useEffect(() => {
    if (voice.status === 'confirming') setShowConfirmation(true);
  }, [voice.status]);

  const handleConfirm = async () => {
    try {
      if (!voice.result) return;
      if (voice.result.categoria === 'treinos') {
        await workouts.addExercises(voice.result.items);
      } else if (voice.result.categoria === 'alimentacao' && voice.result.items[0]) {
        await meals.addMeal(voice.result.items[0]);
      }
      setShowConfirmation(false);
      voice.reset();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <div style={{ flex: 1, paddingBottom: 120 }}>
      <div style={{ padding: '16px 16px 0', overflowY: 'auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>TODAY</h1>
        </header>

        {/* Workouts */}
        <Section title="💪 WORKOUTS">
          {workouts.loading ? (
            <Muted>Carregando…</Muted>
          ) : workouts.workouts.length === 0 ? (
            <Muted>Nenhum treino hoje. Toque no microfone.</Muted>
          ) : (
            workouts.workouts.map((wo) => (
              <Card key={wo.id}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{wo.tipo_treino || 'Workout'}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                  {wo.exercises.length} exercício(s)
                </div>
                {wo.exercises.map((ex: any) => (
                  <div key={ex.id} style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                    • {ex.nome} {ex.sets ?? '?'}×{ex.reps ?? '?'}
                    {ex.peso ? ` · ${ex.peso}${ex.unidade || 'kg'}` : ''}
                  </div>
                ))}
              </Card>
            ))
          )}
        </Section>

        {/* Meals */}
        <Section title="🍔 NUTRITION">
          <div style={{ background: 'var(--card)', borderRadius: 12, padding: 16, textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 32, fontWeight: 600 }}>{Math.round(meals.totalCalories)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>calorias / 2000</div>
          </div>
          {meals.meals.map((meal) => (
            <div
              key={meal.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'var(--card)',
                border: '0.5px solid var(--border)',
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>{meal.alimento}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{meal.calorias_estimadas ?? 0} cal</span>
            </div>
          ))}
        </Section>
      </div>

      {/* Voice button */}
      <div style={{ position: 'fixed', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <VoiceButton onResult={voice.handleVoiceInput} onStatusChange={() => {}} />
      </div>

      {voice.status !== 'idle' && !showConfirmation && (
        <VoiceStatus status={voice.status} message={voice.transcript} />
      )}

      {showConfirmation && (
        <ConfirmationModal result={voice.result} onConfirm={handleConfirm} onCancel={() => setShowConfirmation(false)} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--dim)',
          letterSpacing: 0.5,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '0.5px solid var(--border)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <div style={{ color: 'var(--muted)', fontSize: 14 }}>{children}</div>;
}
