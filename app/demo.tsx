import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStorage } from '@/hooks/useWorkoutStorage';
import { Workout, Exercise, Set } from '@/types/workout';

export default function WorkoutDemo() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  
  const { addWorkout, getLastWeightForExercise } = useWorkoutStorage();
  
  // Estado para demonstrar o controle de séries
  const [demoSets, setDemoSets] = useState<Set[]>([
    { id: '1', reps: 12, weight: 20, completed: false },
    { id: '2', reps: 10, weight: 22.5, completed: false },
    { id: '3', reps: 8, weight: 25, completed: false },
  ]);

  const [newWeight, setNewWeight] = useState('');

  const toggleSetCompletion = (setIndex: number) => {
    setDemoSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, completed: !set.completed } : set
    ));
  };

  const updateSetWeight = (setIndex: number, weight: number) => {
    setDemoSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, weight } : set
    ));
  };

  const createSampleWorkout = async () => {
    const sampleWorkout: Workout = {
      id: Date.now().toString(),
      name: 'Push Day - Exemplo',
      description: 'Treino de demonstração',
      exercises: [
        {
          id: '1',
          name: 'Supino Reto',
          sets: [
            { id: '1', reps: 12, weight: 60, completed: false },
            { id: '2', reps: 10, weight: 65, completed: false },
            { id: '3', reps: 8, weight: 70, completed: false },
          ],
          targetSets: 3,
          targetReps: 10,
          lastWeight: 65,
        },
        {
          id: '2',
          name: 'Supino Inclinado',
          sets: [
            { id: '4', reps: 12, weight: 50, completed: false },
            { id: '5', reps: 10, weight: 52.5, completed: false },
            { id: '6', reps: 8, weight: 55, completed: false },
          ],
          targetSets: 3,
          targetReps: 10,
          lastWeight: 52.5,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      inProgress: false,
    };

    await addWorkout(sampleWorkout);
    alert('Treino de exemplo criado com sucesso!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card title="🏋️‍♂️ Demo - Controle de Séries" style={styles.card}>
          <Text style={styles.description}>
            Marque as séries conforme você as completa durante o treino:
          </Text>
          
          <View style={styles.exerciseDemo}>
            <Text style={styles.exerciseName}>Supino Reto</Text>
            
            {demoSets.map((set, index) => (
              <View key={set.id} style={styles.setRow}>
                <View style={styles.setInfo}>
                  <Text style={styles.setLabel}>Série {index + 1}</Text>
                  <Text style={styles.setDetails}>
                    {set.reps} reps • {set.weight}kg
                  </Text>
                </View>
                
                <Checkbox
                  checked={set.completed}
                  onPress={() => toggleSetCompletion(index)}
                  label={set.completed ? "Concluída" : "Pendente"}
                />
              </View>
            ))}
            
            <Text style={styles.progress}>
              Progresso: {demoSets.filter(s => s.completed).length}/{demoSets.length} séries
            </Text>
          </View>
        </Card>

        <Card title="⚖️ Demo - Controle de Peso" style={styles.card}>
          <Text style={styles.description}>
            Atualize o peso usado em cada série:
          </Text>
          
          <Input
            label="Novo peso (kg)"
            value={newWeight}
            onChangeText={setNewWeight}
            placeholder="Ex: 22.5"
            keyboardType="numeric"
          />
          
          <Button
            title="Atualizar Peso da Primeira Série"
            onPress={() => {
              const weight = parseFloat(newWeight);
              if (!isNaN(weight)) {
                updateSetWeight(0, weight);
                setNewWeight('');
              }
            }}
            disabled={!newWeight}
          />
          
          <View style={styles.weightInfo}>
            <Text style={styles.infoText}>
              Peso atual da 1ª série: {demoSets[0].weight}kg
            </Text>
            <Text style={styles.infoText}>
              Último peso usado (Supino): {getLastWeightForExercise('Supino Reto') || 'Não definido'}
            </Text>
          </View>
        </Card>

        <Card title="💾 Demo - Armazenamento" style={styles.card}>
          <Text style={styles.description}>
            Todos os dados são salvos automaticamente no dispositivo:
          </Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✅ Progresso das séries</Text>
            <Text style={styles.feature}>✅ Pesos utilizados</Text>
            <Text style={styles.feature}>✅ Histórico de treinos</Text>
            <Text style={styles.feature}>✅ Estatísticas pessoais</Text>
          </View>
          
          <Button
            title="Criar Treino de Exemplo"
            onPress={createSampleWorkout}
            variant="primary"
          />
        </Card>

        <Card title="🎯 Funcionalidades Implementadas" style={styles.card}>
          <View style={styles.features}>
            <Text style={styles.feature}>✅ Checkbox para marcar séries concluídas</Text>
            <Text style={styles.feature}>✅ Modal para editar peso dos exercícios</Text>
            <Text style={styles.feature}>✅ Armazenamento local persistente</Text>
            <Text style={styles.feature}>✅ Histórico de pesos por exercício</Text>
            <Text style={styles.feature}>✅ Timer de treino em tempo real</Text>
            <Text style={styles.feature}>✅ Barra de progresso visual</Text>
            <Text style={styles.feature}>✅ Interface responsiva e elegante</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeights.md,
  },
  exerciseDemo: {
    gap: Spacing.sm,
  },
  exerciseName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  setInfo: {
    flex: 1,
  },
  setLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: colors.text,
  },
  setDetails: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  progress: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: Typography.fontWeights.medium,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  weightInfo: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  features: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  feature: {
    fontSize: Typography.fontSizes.sm,
    color: colors.text,
    lineHeight: Typography.lineHeights.sm,
  },
});