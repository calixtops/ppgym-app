import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { workoutTemplates } from '@/constants/workoutTemplates';
import { useWorkoutRotation } from '@/hooks/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStorage } from '@/hooks/useWorkoutStorage';
import { Exercise, Workout } from '@/types/workout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Wrapper da página que obtém o workout pelos parâmetros da URL
export default function ActiveWorkoutPage() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const router = useRouter();
  const { startWorkoutSession } = useWorkoutRotation();

  // Busca o template do workout
  const workoutTemplate = workoutTemplates.find(template => template.id === workoutId);

  if (!workoutTemplate) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Workout não encontrado</Text>
        <Pressable onPress={() => router.back()}>
          <Text>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Cria o workout a partir do template
  const workout: Workout = {
    id: workoutTemplate.id,
    name: workoutTemplate.name,
    description: workoutTemplate.description,
    exercises: workoutTemplate.exercises.map((exercise, exerciseIndex) => ({
      id: `${workoutTemplate.id}-exercise-${exerciseIndex}`,
      name: exercise.name,
      targetSets: exercise.sets,
      targetReps: exercise.reps,
      sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
        id: `${workoutTemplate.id}-exercise-${exerciseIndex}-set-${setIndex}`,
        reps: exercise.reps,
        weight: exercise.weight || 0,
        completed: false,
      })),
      notes: exercise.notes,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    inProgress: true,
    completedAt: undefined,
  };

  const handleComplete = (completedWorkout: Workout) => {
    // Lógica para completar o workout
    router.back();
  };

  const handlePause = (pausedWorkout: Workout) => {
    // Lógica para pausar o workout
    console.log('Workout paused:', pausedWorkout);
  };

  return (
    <ActiveWorkoutScreen 
      workout={workout}
      onComplete={handleComplete}
      onPause={handlePause}
    />
  );
}

// Componente do workout ativo
interface ActiveWorkoutScreenProps {
  workout: Workout;
  onComplete: (workout: Workout) => void;
  onPause: (workout: Workout) => void;
}

function ActiveWorkoutScreen({ 
  workout: initialWorkout, 
  onComplete, 
  onPause 
}: ActiveWorkoutScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  const router = useRouter();
  const { updateWorkout, getLastWeightForExercise, updateExerciseWeight } = useWorkoutStorage();

  // Estados
  const [workout, setWorkout] = useState<Workout>(initialWorkout);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [tempWeight, setTempWeight] = useState('');

  // Timer
  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  // Carrega pesos salvos ao montar o componente
  useEffect(() => {
    const loadWeights = async () => {
      const updatedWorkout = { ...workout };
      for (let i = 0; i < updatedWorkout.exercises.length; i++) {
        const exercise = updatedWorkout.exercises[i];
        const savedWeight = await getLastWeightForExercise(exercise.name);
        if (savedWeight !== null) {
          // Atualiza o peso em todos os sets do exercício
          exercise.sets = exercise.sets.map(set => ({
            ...set,
            weight: savedWeight
          }));
        }
      }
      setWorkout(updatedWorkout);
    };
    loadWeights();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openWeightModal = (exerciseIndex: number, setIndex: number) => {
    console.log('Opening weight modal for exercise', exerciseIndex, 'set', setIndex);
    setCurrentExerciseIndex(exerciseIndex);
    setCurrentSetIndex(setIndex);
    const currentWeight = workout.exercises[exerciseIndex].sets[setIndex].weight;
    setTempWeight(currentWeight?.toString() || '');
    setWeightModalVisible(true);
  };

  const updateWeight = async () => {
    const weight = parseFloat(tempWeight);
    if (!tempWeight || isNaN(weight) || weight < 0) {
      Alert.alert('Erro', 'Digite um peso válido (ex: 20.5)');
      return;
    }

    console.log('Updating weight:', weight, 'for exercise', currentExerciseIndex, 'set', currentSetIndex);

    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[currentExerciseIndex];
    
    // Atualiza o peso no set específico
    exercise.sets[currentSetIndex] = {
      ...exercise.sets[currentSetIndex],
      weight: weight
    };

    // Salva o peso para o exercício (será usado em futuros treinos)
    await updateExerciseWeight(exercise.name, weight);

    setWorkout(updatedWorkout);
    setWeightModalVisible(false);
    setTempWeight('');
    
    // Feedback de sucesso
    Alert.alert('Sucesso', `Peso da série ${currentSetIndex + 1} atualizado para ${weight}kg`);
    console.log('Weight updated successfully');
  };

  const cancelWeightUpdate = () => {
    setWeightModalVisible(false);
    setTempWeight('');
  };

  const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    console.log('Toggling set completion for exercise', exerciseIndex, 'set', setIndex);
    
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[exerciseIndex];
    const set = exercise.sets[setIndex];
    
    // Toggle do status de completion
    const newCompletedStatus = !set.completed;
    exercise.sets[setIndex] = {
      ...set,
      completed: newCompletedStatus
    };

    setWorkout(updatedWorkout);
    
    // Feedback visual com log mais detalhado
    console.log(`Série ${setIndex + 1} do exercício "${exercise.name}" ${newCompletedStatus ? 'marcada como completa' : 'desmarcada'}`);
  };

  const pauseWorkout = () => {
    setIsPaused(true);
    onPause(workout);
  };

  const finishWorkout = async () => {
    const completedSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.filter(set => set.completed).length, 0
    );
    
    const totalSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.length, 0
    );

    if (completedSets === 0) {
      Alert.alert(
        'Treino não iniciado',
        'Você não marcou nenhuma série como concluída. Deseja finalizar mesmo assim?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar', onPress: () => completeWorkout() }
        ]
      );
      return;
    }

    if (completedSets < totalSets) {
      Alert.alert(
        'Treino incompleto',
        `Você completou ${completedSets} de ${totalSets} séries. Deseja finalizar o treino?`,
        [
          { text: 'Continuar', style: 'cancel' },
          { text: 'Finalizar', onPress: () => completeWorkout() }
        ]
      );
      return;
    }

    completeWorkout();
  };

  const completeWorkout = async () => {
    const completedWorkout = {
      ...workout,
      completed: true,
      duration: elapsedTime,
      completedAt: new Date()
    };

    await updateWorkout(completedWorkout);
    onComplete(completedWorkout);
  };

  const getCompletedSetsCount = (exercise: Exercise) => {
    return exercise.sets.filter(set => set.completed).length;
  };

  const WeightModal = () => (
    <Modal
      visible={weightModalVisible}
      transparent
      animationType="slide"
      onRequestClose={cancelWeightUpdate}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            ⚖️ Definir Peso
          </Text>
          <Text style={styles.modalSubtitle}>
            {workout.exercises[currentExerciseIndex]?.name} - Série {currentSetIndex + 1}
          </Text>
          
          <Input
            label="Peso (kg)"
            value={tempWeight}
            onChangeText={setTempWeight}
            placeholder="Ex: 20.5"
            keyboardType="numeric"
          />
          
          <View style={styles.modalButtons}>
            <Pressable 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={cancelWeightUpdate}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={updateWeight}
            >
              <Text style={styles.confirmButtonText}>✅ Salvar</Text>
            </Pressable>
          </View>
          
          <Text style={[styles.modalSubtitle, { marginTop: Spacing.sm, fontSize: Typography.fontSizes.xs, fontStyle: 'italic' }]}>
            💡 Este peso será salvo para as próximas vezes
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={pauseWorkout} style={styles.headerButton}>
            <IconSymbol name="pause" size={24} color={colors.icon} />
          </Pressable>
          <View>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>
        <Pressable onPress={finishWorkout} style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finalizar</Text>
        </Pressable>
      </View>

      {/* Exercises */}
      <ScrollView style={styles.exercisesList} showsVerticalScrollIndicator={false}>
        {workout.exercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.id} title={exercise.name} style={styles.exerciseCard}>
            <Text style={styles.exerciseProgress}>
              {getCompletedSetsCount(exercise)}/{exercise.sets.length} séries concluídas
            </Text>
            
            <View style={styles.setsContainer}>
              {exercise.sets.map((set, setIndex) => (
                <View 
                  key={setIndex} 
                  style={[
                    styles.setRow,
                    set.completed && styles.setRowCompleted
                  ]}
                >
                  <View style={styles.setInfo}>
                    <Text style={[styles.setLabel, set.completed && styles.completedText]}>
                      Série {setIndex + 1}
                    </Text>
                    <Text style={[styles.setDetails, set.completed && styles.completedText]}>
                      {set.reps} reps • {set.weight || 0}kg
                    </Text>
                  </View>
                  
                  <View style={styles.setActions}>
                    <Pressable 
                      onPress={() => openWeightModal(exerciseIndex, setIndex)}
                      style={[
                        styles.weightButton,
                        set.completed && styles.weightButtonCompleted
                      ]}
                    >
                      <IconSymbol 
                        name="scalemass" 
                        size={14} 
                        color={set.completed ? colors.success : colors.primary} 
                      />
                      <Text style={[
                        styles.weightButtonText,
                        set.completed && styles.weightButtonTextCompleted
                      ]}>
                        {set.completed ? '✅ ' : ''}{set.weight || 0}kg
                      </Text>
                    </Pressable>
                    
                    <Checkbox
                      checked={set.completed}
                      onPress={() => toggleSetCompletion(exerciseIndex, setIndex)}
                      size="medium"
                    />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>

      <WeightModal />
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.primary + '20',
  },
  workoutName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
  },
  timerText: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
  },
  finishButton: {
    backgroundColor: colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  exercisesList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  exerciseCard: {
    marginBottom: Spacing.md,
  },
  exerciseProgress: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: Spacing.md,
  },
  setsContainer: {
    gap: Spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  setRowCompleted: {
    backgroundColor: colors.success + '15',
    borderColor: colors.success,
    borderWidth: 2,
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
  completedText: {
    color: colors.success,
    textDecorationLine: 'line-through',
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  weightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  weightButtonText: {
    fontSize: Typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: Typography.fontWeights.medium,
  },
  weightButtonCompleted: {
    backgroundColor: colors.success + '20',
  },
  weightButtonTextCompleted: {
    color: colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
});