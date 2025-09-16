import { HeroSection } from '@/components/shared/HeroSection';
import { createSharedHomeScreenStyles } from '@/components/shared/HomeScreenStyles';
import { ProgramHeader } from '@/components/shared/ProgramHeader';
import { QuickActionsSection } from '@/components/shared/QuickActionsSection';
import { RecentWorkoutsSection } from '@/components/shared/RecentWorkoutsSection';
import { StatsSection } from '@/components/shared/StatsSection';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WorkoutStartModal } from '@/components/WorkoutStartModal';
import { WorkoutSummaryModal } from '@/components/WorkoutSummaryModal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStorage } from '@/hooks/useWorkoutStorage';
import { useWorkoutRotation } from '@/hooks/WorkoutContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GeorgiaHomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { 
    getTodaysWorkoutTemplate, 
    isTodaysWorkoutCompleted, 
    getNextWorkoutTemplate,
    getTomorrowsWorkoutTemplate,
    getStats,
    getWorkoutHistory,
    workoutSessions,
    getCurrentWorkoutTemplate_Simple,
    getNextWorkoutTemplate_Simple_New,
    completedWorkoutsCount,
    switchProgram
  } = useWorkoutRotation();

  const { workouts } = useWorkoutStorage();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState<any>(null);

  const currentWorkout = getTodaysWorkoutTemplate();
  const nextWorkout = getNextWorkoutTemplate();
  const tomorrowWorkout = getTomorrowsWorkoutTemplate();
  
  // Sistema simples baseado em contador
  const currentWorkoutSimple = getCurrentWorkoutTemplate_Simple();
  const nextWorkoutSimple = getNextWorkoutTemplate_Simple_New();
  
  // Lógica simples: se tem treinos completados hoje, mostra próximo; senão mostra atual
  const hasCompletedWorkouts = workoutSessions.filter(s => s.completed).length > 0;
  const workoutStatus = hasCompletedWorkouts ? 'completed' : 'pending';
  const workoutToShow = currentWorkoutSimple;

  // Atualizar quando uma sessão de treino for completada
  useEffect(() => {
    if (workoutSessions.length > 0) {
      const lastSession = workoutSessions[workoutSessions.length - 1];
      const today = new Date().toDateString();
      if (lastSession.completed && new Date(lastSession.date).toDateString() === today) {
        setLastCompletedWorkout(lastSession);
      }
    }
  }, [workoutSessions]);

  // Força uma re-renderização quando a tela recebe foco (volta do workout-detail)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Georgia Home screen recebeu foco - forçando re-renderização');
      // Força uma re-avaliação do estado
    }, [])
  );

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getMotivationalMessage = () => {
    const messages = [
      'Pronta para treinar hoje, Georgia?',
      'Vamos conquistar seus objetivos juntas!',
      'Seu corpo agradece cada treino!',
      'Força e determinação, sempre!',
      'Hoje é dia de superar seus limites!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getWorkoutStats = () => {
    const stats = getStats();
    return stats;
  };

  const getRecentWorkouts = () => {
    const history = getWorkoutHistory();
    return history.slice(0, 3);
  };

  // Usar useMemo para que recentWorkouts seja recalculado quando workoutSessions mudar
  const recentWorkouts = useMemo(() => {
    const history = getWorkoutHistory();
    console.log('🔄 Recalculando treinos recentes da Georgia. Total no histórico:', history.length);
    return history.slice(0, 3);
  }, [workoutSessions]);

  const handleStartWorkout = (workoutId?: string) => {
    console.log('handleStartWorkout Georgia chamado com workoutId:', workoutId);
    console.log('workoutStatus:', workoutStatus);
    console.log('workoutToShow:', workoutToShow);
    
    setShowStartModal(false);
    
    // Se um workoutId específico foi passado, usa ele
    if (workoutId) {
      console.log('Navegando para workoutId específico:', workoutId);
      router.push(`/workout-detail?workoutId=${workoutId}`);
      return;
    }
    
    // Sempre inicia o treino que está sendo mostrado (atual ou próximo)
    if (workoutToShow) {
      console.log('Iniciando treino:', workoutToShow.id);
      router.push(`/workout-detail?workoutId=${workoutToShow.id}`);
    }
  };

  const handleStartTomorrowWorkout = () => {
    console.log('handleStartTomorrowWorkout Georgia chamado');
    console.log('tomorrowWorkout:', tomorrowWorkout);
    console.log('isTodaysWorkoutCompleted:', isTodaysWorkoutCompleted());
    
    if (tomorrowWorkout) {
      console.log('Iniciando treino de amanhã:', tomorrowWorkout.id);
      router.push(`/workout-detail?workoutId=${tomorrowWorkout.id}`);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'today':
        if (workoutToShow) {
          router.push(`/workout-detail?workoutId=${workoutToShow.id}`);
        }
        break;
      case 'tomorrow':
        if (tomorrowWorkout) {
          router.push(`/workout-detail?workoutId=${tomorrowWorkout.id}`);
        }
        break;
      case 'history':
        router.push('/modal');
        break;
      case 'pedro':
        Alert.alert(
          'Trocar para Pedro',
          'Você quer alterar para o programa do Pedro?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Sim', 
              onPress: () => switchProgram('pedro')
            }
          ]
        );
        break;
    }
  };

  const handleSwitchProgram = () => {
    Alert.alert(
      'Trocar Programa',
      'Deseja trocar para o programa do Pedro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: () => switchProgram('pedro')
        }
      ]
    );
  };

  const stats = getWorkoutStats();

  // Debug logs para verificar estado
  console.log('🏠 GEORGIA HOME SCREEN RENDER:');
  console.log('  - workoutSessions total:', workoutSessions.length);
  console.log('  - hasCompletedWorkouts:', hasCompletedWorkouts);
  console.log('  - workoutStatus:', workoutStatus);
  console.log('  - completedWorkoutsCount:', completedWorkoutsCount);
  console.log('  - currentWorkoutSimple:', currentWorkoutSimple?.name);
  console.log('  - nextWorkoutSimple:', nextWorkoutSimple?.name);
  console.log('  - workoutToShow:', workoutToShow?.name);
  console.log('  - isTodaysWorkoutCompleted():', isTodaysWorkoutCompleted());
  
  // Log dos treinos completados
  const completedSessions = workoutSessions.filter(s => s.completed);
  console.log('  - Treinos completados:', completedSessions.map(s => ({ 
    id: s.workoutId, 
    date: new Date(s.date).toDateString() 
  })));

  // Preparar dados para os componentes compartilhados
  const quickActions = [
    {
      title: 'Treino de Hoje',
      description: workoutToShow?.name || 'Nenhum treino',
      icon: 'figure.strengthtraining.traditional',
      onPress: () => handleQuickAction('today')
    },
    {
      title: 'Próximo Treino',
      description: tomorrowWorkout?.name || 'N/A',
      icon: 'calendar',
      onPress: () => handleQuickAction('tomorrow')
    },
    {
      title: 'Histórico',
      description: 'Ver treinos anteriores',
      icon: 'chart.bar',
      onPress: () => handleQuickAction('history')
    },
    {
      title: 'Programa Pedro',
      description: 'Trocar para Pedro',
      icon: 'person.2',
      onPress: () => handleQuickAction('pedro')
    }
  ];

  const recentWorkoutsFormatted = recentWorkouts.map(workout => ({
    name: workout.workoutName || 'Treino sem nome',
    date: new Date(workout.date).toLocaleDateString('pt-BR'),
    duration: workout.duration?.toString() || 'N/A',
    exercises: workout.exercises?.length || 0
  }));

  if (!workoutToShow) {
    return (
      <SafeAreaView style={createSharedHomeScreenStyles(colors, true).container} edges={['top']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={createSharedHomeScreenStyles(colors, true).emptyState}>
          <IconSymbol name="figure.strengthtraining.traditional" size={64} color={colors.textSecondary} />
          <Text style={createSharedHomeScreenStyles(colors, true).emptyStateText}>
            Nenhum treino programado!{'\n'}
            Configure seu programa de treinos para começar.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={createSharedHomeScreenStyles(colors, true).container} edges={['top']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ProgramHeader 
        colors={colors}
        isGeorgia={true}
        onSwitchProgram={handleSwitchProgram}
      />
      
      <ScrollView 
        style={createSharedHomeScreenStyles(colors, true).scrollView} 
        contentContainerStyle={createSharedHomeScreenStyles(colors, true).scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <HeroSection
          colors={colors}
          isGeorgia={true}
          greeting={`${getTimeBasedGreeting()}, Georgia`}
          subtitle={getMotivationalMessage()}
          workoutToShow={workoutToShow}
          workoutStatus={workoutStatus as 'completed' | 'pending'}
          onStartWorkout={handleStartWorkout}
          onStartTomorrowWorkout={handleStartTomorrowWorkout}
          isTodaysWorkoutCompleted={isTodaysWorkoutCompleted()}
          tomorrowWorkout={tomorrowWorkout}
        />

        <StatsSection
          colors={colors}
          isGeorgia={true}
          stats={stats}
        />

        <QuickActionsSection
          colors={colors}
          isGeorgia={true}
          actions={quickActions}
        />

        <RecentWorkoutsSection
          colors={colors}
          isGeorgia={true}
          workouts={recentWorkoutsFormatted}
        />

      </ScrollView>

      <WorkoutStartModal
        visible={showStartModal}
        onClose={() => setShowStartModal(false)}
        onStart={handleStartWorkout}
        workoutId={workoutToShow?.id || ''}
      />

      <WorkoutSummaryModal
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        workoutSession={lastCompletedWorkout}
        totalTime={lastCompletedWorkout?.duration ? `${lastCompletedWorkout.duration} min` : "45 min"}
        nextWorkoutName={tomorrowWorkout?.name}
      />

      />
    </SafeAreaView>
  );
}
