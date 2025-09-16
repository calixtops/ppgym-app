import { RestTimer } from '@/components/RestTimer';
import { WorkoutSummaryModal } from '@/components/WorkoutSummaryModal';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useWorkoutRotation, WorkoutSession } from '@/hooks/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Função para obter a imagem do exercício (prioriza template, depois mapeamento)
const getExerciseImage = (exercise: any) => {
  // Primeiro, verifica se o exercício tem uma imagem no template
  if (exercise.image) {
    return exercise.image;
  }
  
  // Se não, usa o mapeamento por nome
  return getExerciseGif(exercise.name);
};

// Mapeamento dos exercícios para seus respectivos GIFs
const getExerciseGif = (exerciseName: string) => {
  const exerciseGifMap: { [key: string]: any } = {
    // Treino A - Pernas + Core
    'Agachamento livre': require('@/assets/images/exercicios/treino_A/agachamento-com-barra.gif'),
    'Leg press ou Hack': require('@/assets/images/exercicios/treino_A/leg-press.gif'),
    'Afundo / avanço (halter ou barra)': require('@/assets/images/exercicios/treino_A/avanco-com-halteras.gif'),
    'Mesa flexora': require('@/assets/images/exercicios/treino_A/mesa-flexora.gif'),
    'Cadeira extensora': require('@/assets/images/exercicios/treino_A/cadeira-extensora-extensora.gif'),
    'Panturrilha em pé': require('@/assets/images/exercicios/treino_A/panturrilha-pe.gif'),
    'Panturrilha sentado': require('@/assets/images/exercicios/treino_A/panturrilha-sentado.gif'),
    'Prancha': require('@/assets/images/exercicios/treino_A/core-prancha.jpg'),
    'Abdominal no cabo': require('@/assets/images/exercicios/treino_A/abdominal-cabo.gif'),
    
    // Treino B - Peito + Tríceps
    'Supino reto': require('@/assets/images/exercicios/treino_B/supino-reto.gif'),
    'Supino inclinado': require('@/assets/images/exercicios/treino_B/supino-inclinado.gif'),
    'Crucifixo (máquina ou halteres)': require('@/assets/images/exercicios/treino_B/crucifixo.gif'),
    'Cross-over': require('@/assets/images/exercicios/treino_B/cross-over.gif'),
    'Tríceps pulley (barra ou corda)': require('@/assets/images/exercicios/treino_B/tricep-pulley.gif'),
    'Tríceps francês / testa': require('@/assets/images/exercicios/treino_B/triceps-frances-unilateral.gif'),
    'Dips/paralelas': require('@/assets/images/exercicios/treino_B/dips-paralelas.gif'),
  };
  
  return exerciseGifMap[exerciseName] || null;
};

export default function WorkoutDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  const router = useRouter();
  const params = useLocalSearchParams<{ workoutId: string }>();
  
  // Debug and fix workoutId parameter
  console.log('workout-detail: Raw params received:', params);
  console.log('workout-detail: Raw workoutId:', params.workoutId);
  console.log('workout-detail: Type of workoutId:', typeof params.workoutId);
  
  // Ensure we have a clean string ID
  let workoutId = params.workoutId;
  if (Array.isArray(workoutId)) {
    workoutId = workoutId[0];
  }
  if (typeof workoutId !== 'string') {
    console.error('workout-detail: workoutId is not a string:', workoutId);
    workoutId = String(workoutId);
  }
  
  // If it's "[object Object]", we have a problem - let's try to recover
  if (workoutId === '[object Object]') {
    console.error('workout-detail: Received [object Object] as workoutId, this indicates an object was passed instead of string');
    // Navigate back with an error
    Alert.alert(
      'Erro de Navegação',
      'ID do treino inválido. Voltando para a tela inicial.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
    return null;
  }
  
  console.log('workout-detail: Final cleaned workoutId:', workoutId);

  const {
    startWorkoutSession,
    completeSet,
    updateExerciseWeight,
    updateWorkoutProgress,
    completeWorkout,
    workoutSessions,
    getNextWorkoutTemplate,
  } = useWorkoutRotation();

  // Estados principais
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  
  // Estados para edição inline (inspirado no teste)
  const [setsCompleted, setSetsCompleted] = useState<{ [exerciseId: string]: boolean[] }>({});
  const [exerciseWeights, setExerciseWeights] = useState<{ [exerciseId: string]: number }>({});
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [tempWeight, setTempWeight] = useState('');
  
  // Estados para timer de descanso
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(30);
  
  // Estado para modal do GIF
  const [showGifModal, setShowGifModal] = useState(false);

  // Inicializa a sessão de treino
  useEffect(() => {
    if (!workoutId) return;
    
    console.log('workout-detail: Iniciando sessão para workoutId:', workoutId);
    
    const initSession = async () => {
      // Usa o workoutId da URL em vez de sempre usar o treino de hoje
      const session = await startWorkoutSession(workoutId);
      setCurrentSession(session);
      
      console.log('workout-detail: Sessão criada:', session);
      
      if (session.completed) {
        setShowSummaryModal(true);
        if (session.duration) {
          setElapsedTime(session.duration * 60);
        }
      } else {
        setStartTime(new Date(session.date));
        
        // Inicializa estados locais baseados na sessão
        const initialSets: { [exerciseId: string]: boolean[] } = {};
        const initialWeights: { [exerciseId: string]: number } = {};
        
        session.exercises.forEach(exercise => {
          // Cria array de booleans baseado em completedSets
          // completedSets é um array como [0, 1, 0, 0] onde 1 = completado
          const sets = exercise.completedSets?.map(value => value === 1) || new Array(exercise.sets).fill(false);
          
          initialSets[exercise.exerciseId] = sets;
          initialWeights[exercise.exerciseId] = exercise.weight || 0;
        });
        
        console.log('🎯 Estados inicializados:', { initialSets, initialWeights });
        setSetsCompleted(initialSets);
        setExerciseWeights(initialWeights);
      }
    };
    
    initSession();
  }, [workoutId]);

  // Timer em tempo real
  useEffect(() => {
    if (!startTime || isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  // Sincroniza com o hook global
  useEffect(() => {
    if (currentSession) {
      const updatedSession = workoutSessions.find(s => s.id === currentSession.id);
      if (updatedSession && updatedSession !== currentSession) {
        console.log('🔄 Sincronizando sessão atualizada');
        setCurrentSession(updatedSession);
        
        // Atualiza estados locais com dados do hook
        const newSets: { [exerciseId: string]: boolean[] } = {};
        updatedSession.exercises.forEach(exercise => {
          // Converte completedSets [0,1,0,0] para array de booleans [false,true,false,false]
          const sets = exercise.completedSets?.map(value => value === 1) || new Array(exercise.sets).fill(false);
          newSets[exercise.exerciseId] = sets;
        });
        setSetsCompleted(newSets);
      }
    }
  }, [workoutSessions, currentSession?.id]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Função para marcar/desmarcar série (inspirada no teste)
  const toggleSetCompletion = (exerciseId: string, setIndex: number) => {
    console.log('🎯 Toggling set:', { exerciseId, setIndex });
    
    if (!currentSession || currentSession.completed) {
      console.log('❌ Não pode alterar - sessão inválida ou completa');
      return;
    }
    
    // Pega o estado atual da série
    const currentSets = setsCompleted[exerciseId] || [];
    const wasCompleted = currentSets[setIndex] || false;
    const willBeCompleted = !wasCompleted;
    
    // Atualiza estado local imediatamente
    setSetsCompleted(prev => {
      const exerciseSets = [...(prev[exerciseId] || [])];
      exerciseSets[setIndex] = willBeCompleted;
      console.log('✅ Set toggled locally:', exerciseSets);
      return { ...prev, [exerciseId]: exerciseSets };
    });
    
    // Atualiza no hook global com o valor correto
    updateWorkoutProgress(currentSession.id, exerciseId, setIndex, willBeCompleted);
    
    // Mostrar timer de descanso quando uma série for completada
    if (willBeCompleted) {
      setShowRestTimer(true);
    }
  };

  // Função para atualizar peso (inspirada no teste)
  const handleWeightUpdate = (exerciseId: string, newWeight: string) => {
    const weight = parseFloat(newWeight);
    
    if (!newWeight || isNaN(weight) || weight < 0) {
      Alert.alert('Erro', 'Digite um peso válido (ex: 20.5)');
      return;
    }
    
    console.log('💪 Updating weight:', { exerciseId, weight });
    
    // Atualiza estado local imediatamente (como no teste que funciona)
    setExerciseWeights(prev => ({
      ...prev,
      [exerciseId]: weight
    }));
    
    // Atualiza no hook global
    if (currentSession) {
      updateExerciseWeight(currentSession.id, exerciseId, weight);
    }
    
    setEditingWeight(null);
    setTempWeight('');
    
    Alert.alert('Sucesso! 💪', `Peso atualizado para ${weight}kg`);
  };

  const startWeightEdit = (exerciseId: string) => {
    setEditingWeight(exerciseId);
    setTempWeight((exerciseWeights[exerciseId] || 0).toString());
  };

  const cancelWeightEdit = () => {
    setEditingWeight(null);
    setTempWeight('');
  };

  const nextExercise = () => {
    if (currentSession?.completed) return;
    
    if (currentExerciseIndex < (currentSession?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      finishWorkout();
    }
  };

  const previousExercise = () => {
    if (currentSession?.completed) return;
    
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const finishWorkout = () => {
    if (!currentSession) return;
    
    Alert.alert(
      'Finalizar Treino 🏁',
      'Tem certeza que deseja finalizar o treino?',
      [
        { text: 'Continuar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          onPress: () => {
            const duration = Math.floor(elapsedTime / 60);
            completeWorkout(currentSession.id, duration);
            setShowSummaryModal(true);
          }
        }
      ]
    );
  };

  if (!currentSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🏋️‍♂️ Preparando seu treino...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = currentSession.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === currentSession.exercises.length - 1;
  const isFirstExercise = currentExerciseIndex === 0;
  const isWorkoutCompleted = currentSession.completed;
  const currentSets = setsCompleted[currentExercise?.exerciseId] || [];
  const completedSetsCount = currentSets.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header com timer e controles */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <View>
            <Text style={styles.workoutTitle}>
              {isWorkoutCompleted ? '🏁 Treino Finalizado' : 
               isPaused ? '⏸️ Treino Pausado' : '💪 Treino em Andamento'}
            </Text>
            <View style={styles.timerContainer}>
              <IconSymbol name="clock" size={16} color={colors.primary} />
              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            </View>
          </View>
        </View>
        
        {!isWorkoutCompleted && (
          <View style={styles.headerActions}>
            <Pressable 
              style={[styles.controlButton, isPaused && styles.playButton]} 
              onPress={() => setIsPaused(!isPaused)}
            >
              <IconSymbol 
                name={isPaused ? "play.fill" : "pause.fill"} 
                size={18} 
                color={isPaused ? colors.success : colors.warning} 
              />
            </Pressable>
            <Pressable style={styles.finishButton} onPress={finishWorkout}>
              <Text style={styles.finishButtonText}>Finalizar</Text>
            </Pressable>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Exercício {currentExerciseIndex + 1} de {currentSession.exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentExerciseIndex + 1) / currentSession.exercises.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Exercício atual - card principal */}
        <Card style={styles.currentExerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{currentExercise.name}</Text>
              <Text style={styles.exerciseDetails}>
                {currentExercise.sets} séries × {currentExercise.reps} repetições
              </Text>
              <Text style={styles.exerciseProgress}>
                {completedSetsCount}/{currentExercise.sets} séries concluídas
              </Text>
            </View>
          </View>

          {/* Seção de séries com peso na mesma linha */}
          <View style={styles.setsSection}>
            <View style={styles.setsHeader}>
              <Text style={styles.sectionTitle}>🎯 Séries</Text>
              
              {/* Input de peso minimalista */}
              <View style={styles.weightContainer}>
                {editingWeight === currentExercise.exerciseId ? (
                  <View style={styles.weightEditInline}>
                    <Input
                      value={tempWeight}
                      onChangeText={setTempWeight}
                      placeholder="kg"
                      keyboardType="numeric"
                      style={styles.weightInputInline}
                    />
                    <Pressable onPress={cancelWeightEdit} style={styles.weightCancelBtn}>
                      <IconSymbol name="xmark" size={14} color={colors.textSecondary} />
                    </Pressable>
                    <Pressable 
                      onPress={() => handleWeightUpdate(currentExercise.exerciseId, tempWeight)}
                      style={styles.weightSaveBtn}
                    >
                      <IconSymbol name="checkmark" size={14} color={colors.success} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable 
                    style={styles.weightDisplayInline}
                    onPress={() => startWeightEdit(currentExercise.exerciseId)}
                  >
                    <Text style={styles.weightTextInline}>
                      {exerciseWeights[currentExercise.exerciseId] || 0}kg
                    </Text>
                    <IconSymbol name="pencil" size={12} color={colors.primary} />
                  </Pressable>
                )}
              </View>
            </View>
            
            <View style={styles.setsGrid}>
              {Array.from({ length: currentExercise.sets }, (_, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.setButton,
                    currentSets[index] && styles.setButtonCompleted
                  ]}
                  onPress={() => toggleSetCompletion(currentExercise.exerciseId, index)}
                >
                  {currentSets[index] ? (
                    <IconSymbol name="checkmark" size={20} color="#ffffff" />
                  ) : (
                    <Text style={styles.setButtonText}>{index + 1}</Text>
                  )}
                </Pressable>
              ))}
            </View>
            
            {/* Linha do GIF */}
            {getExerciseImage(currentExercise) && (
              <Pressable 
                style={styles.gifSection}
                onPress={() => setShowGifModal(true)}
                android_ripple={{ color: colors.primary + '20' }}
              >
                <View style={styles.gifSectionContent}>
                  <View style={styles.gifThumbnail}>
                    <Image 
                      source={getExerciseImage(currentExercise)}
                      style={styles.exerciseGifSmall}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.gifSectionText}>Ver demonstração do exercício</Text>
                  <IconSymbol name="chevron.right" size={16} color={colors.primary} />
                </View>
              </Pressable>
            )}
            
            {/* Barra de progresso das séries */}
            <View style={styles.setsProgressContainer}>
              <View style={styles.setsProgressBar}>
                <View 
                  style={[
                    styles.setsProgressFill, 
                    { width: `${(completedSetsCount / currentExercise.sets) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.setsProgressText}>
                {completedSetsCount}/{currentExercise.sets}
              </Text>
            </View>
          </View>
        </Card>

        {/* Navegação entre exercícios */}
        <View style={styles.navigationContainer}>
          <Pressable 
            style={[styles.navButton, isFirstExercise && styles.navButtonDisabled]}
            onPress={previousExercise}
            disabled={isFirstExercise || isWorkoutCompleted}
          >
            <IconSymbol 
              name="chevron.left" 
              size={20} 
              color={isFirstExercise ? colors.textSecondary : colors.primary} 
            />
            <Text style={[
              styles.navButtonText,
              isFirstExercise && styles.navButtonTextDisabled
            ]}>
              Anterior
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.navButton, styles.nextButton]}
            onPress={nextExercise}
            disabled={isWorkoutCompleted}
          >
            <Text style={styles.nextButtonText}>
              {isLastExercise ? 'Finalizar' : 'Próximo'}
            </Text>
            <IconSymbol 
              name={isLastExercise ? "flag.checkered" : "chevron.right"} 
              size={20} 
              color="#ffffff" 
            />
          </Pressable>
        </View>

        {/* Lista de todos os exercícios */}
        <Card title="📋 Todos os Exercícios" style={styles.allExercisesCard}>
          {currentSession.exercises.map((exercise, index) => {
            const exerciseSets = setsCompleted[exercise.exerciseId] || [];
            const exerciseCompletedCount = exerciseSets.filter(Boolean).length;
            const isActive = index === currentExerciseIndex;
            
            return (
              <Pressable
                key={exercise.exerciseId}
                style={[
                  styles.exerciseListItem,
                  isActive && styles.exerciseListItemActive
                ]}
                onPress={() => setCurrentExerciseIndex(index)}
              >
                <View style={styles.exerciseListInfo}>
                  <Text style={[
                    styles.exerciseListName,
                    isActive && styles.exerciseListNameActive
                  ]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseListDetails}>
                    {exercise.sets} séries × {exercise.reps} reps
                  </Text>
                </View>
                <View style={styles.exerciseListProgress}>
                  <Text style={styles.exerciseListProgressText}>
                    {exerciseCompletedCount}/{exercise.sets}
                  </Text>
                  {exerciseCompletedCount === exercise.sets && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </Card>
      </ScrollView>

      {/* GIF Modal */}
      <Modal
        visible={showGifModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGifModal(false)}
      >
        <View style={styles.gifModalOverlay}>
          <View style={styles.gifModalContainer}>
            <View style={styles.gifModalHeader}>
              <Text style={styles.gifModalTitle}>{currentExercise.name}</Text>
              <Pressable onPress={() => setShowGifModal(false)} style={styles.gifModalCloseButton}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </Pressable>
            </View>
            {getExerciseImage(currentExercise) && (
              <Image 
                source={getExerciseImage(currentExercise)}
                style={styles.gifModalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Rest Timer Modal */}
      {showRestTimer && (
        <RestTimer
          isActive={showRestTimer}
          duration={restDuration}
          onComplete={() => setShowRestTimer(false)}
          onSkip={() => setShowRestTimer(false)}
        />
      )}

      {/* Workout Summary Modal */}
      <WorkoutSummaryModal
        visible={showSummaryModal}
        onClose={() => {
          setShowSummaryModal(false);
          // Força uma navegação que recarregue a home screen
          router.push('/(tabs)');
        }}
        workoutSession={currentSession}
        totalTime={formatTime(elapsedTime)}
        nextWorkoutName={getNextWorkoutTemplate()?.name}
      />
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
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  workoutTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  timerText: {
    fontSize: Typography.fontSizes.md,
    color: colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  controlButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.warning + '20',
  },
  playButton: {
    backgroundColor: colors.success + '20',
  },
  finishButton: {
    backgroundColor: colors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  finishButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.sm,
  },
  currentExerciseCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  exerciseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  exerciseGif: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
  },
  gifContainer: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  gifOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: BorderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  exerciseProgress: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  weightSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.md,
  },
  weightEditContainer: {
    gap: Spacing.md,
  },
  weightInput: {
    marginBottom: 0,
  },
  weightEditActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  weightEditButton: {
    flex: 1,
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  weightText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
  },
  setsSection: {
    marginBottom: Spacing.lg,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightEditInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weightInputInline: {
    width: 60,
    height: 32,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    marginBottom: 0,
  },
  weightCancelBtn: {
    padding: 4,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.sm,
  },
  weightSaveBtn: {
    padding: 4,
    backgroundColor: colors.success + '20',
    borderRadius: BorderRadius.sm,
  },
  weightDisplayInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weightTextInline: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
  },
  gifSection: {
    marginTop: Spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gifSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  gifThumbnail: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  exerciseGifSmall: {
    width: 64,
    height: 64,
  },
  gifSectionText: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  setsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  setButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  setButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
  },
  setsProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  setsProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  setsProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: BorderRadius.sm,
  },
  setsProgressText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: Typography.fontSizes.md,
    color: colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  allExercisesCard: {
    marginBottom: Spacing.xl,
  },
  exerciseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseListItemActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  exerciseListInfo: {
    flex: 1,
  },
  exerciseListName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  exerciseListNameActive: {
    color: colors.primary,
  },
  exerciseListDetails: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  exerciseListProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  exerciseListProgressText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Estilos do modal do GIF
  gifModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  gifModalContainer: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  gifModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gifModalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    flex: 1,
  },
  gifModalCloseButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.backgroundSecondary,
  },
  gifModalImage: {
    width: '100%',
    height: 300,
    borderRadius: BorderRadius.lg,
  },
});