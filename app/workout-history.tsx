import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutRotation } from '@/hooks/WorkoutContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  
  const { getWorkoutHistory, getStats, deleteWorkoutSession } = useWorkoutRotation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');
  
  const allWorkouts = getWorkoutHistory();
  const stats = getStats();
  
  const getFilteredWorkouts = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return allWorkouts.filter((w: any) => new Date(w.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return allWorkouts.filter((w: any) => new Date(w.date) >= monthAgo);
      default:
        return allWorkouts;
    }
  };
  
  const filteredWorkouts = getFilteredWorkouts();
  
  const handleDeleteWorkout = (sessionId: string, workoutName: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o treino "${workoutName}"?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteWorkoutSession(sessionId);
            console.log('🗑️ Treino excluído:', sessionId);
          },
        },
      ],
    );
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  const getWorkoutName = (workoutId: string) => {
    const workoutNames: { [key: string]: string } = {
      'template-a': 'A — Pernas + Core',
      'template-b': 'B — Peito + Tríceps',
      'template-c': 'C — Costas + Bíceps',
      'template-d': 'D — Ombro + Trapézio + Core',
      'template-e': 'E — Pernas (variação)',
    };
    return workoutNames[workoutId] || `Treino ${workoutId.replace('template-', '').toUpperCase()}`;
  };
  
  const renderWorkoutItem = ({ item }: { item: any }) => {
    const completedSets = item.exercises.reduce((sum: number, ex: any) => sum + (ex.completedSets?.length || 0), 0);
    const totalSets = item.exercises.reduce((sum: number, ex: any) => sum + ex.sets, 0);
    const completionRate = Math.round((completedSets / totalSets) * 100);
    const workoutName = getWorkoutName(item.workoutId);
    
    return (
      <Card style={styles.workoutCard}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{workoutName}</Text>
            <Text style={styles.workoutDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.workoutHeaderRight}>
            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <IconSymbol name="clock" size={14} color={colors.textSecondary} />
                <Text style={styles.statText}>{formatDuration(item.duration)}</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol name="target" size={14} color={colors.textSecondary} />
                <Text style={styles.statText}>{completionRate}%</Text>
              </View>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteWorkout(item.id, workoutName)}
            >
              <IconSymbol name="trash" size={16} color={colors.error} />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.exercisesList}>
          {item.exercises.slice(0, 3).map((exercise: any, index: number) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName} numberOfLines={1}>
                {exercise.name}
              </Text>
              <Text style={styles.exerciseDetails}>
                {exercise.completedSets?.length || 0}/{exercise.sets} séries
                {exercise.weight ? ` • ${exercise.weight}kg` : ''}
              </Text>
            </View>
          ))}
          {item.exercises.length > 3 && (
            <Text style={styles.moreExercises}>
              +{item.exercises.length - 3} exercícios
            </Text>
          )}
        </View>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Histórico de Treinos</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Stats Summary */}
      <Card style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.thisWeek}</Text>
            <Text style={styles.statLabel}>Esta Semana</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.thisMonth}</Text>
            <Text style={styles.statLabel}>Este Mês</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {stats.total > 0 ? Math.round(allWorkouts.reduce((acc: number, w: any) => acc + (w.duration || 45), 0) / stats.total) : 0}m
            </Text>
            <Text style={styles.statLabel}>Média</Text>
          </View>
        </View>
      </Card>
      
      {/* Period Filter */}
      <View style={styles.filterContainer}>
        {(['week', 'month', 'all'] as const).map((period) => (
          <Pressable
            key={period}
            style={[
              styles.filterButton,
              selectedPeriod === period && styles.filterButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedPeriod === period && styles.filterButtonTextActive
            ]}>
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Todos'}
            </Text>
          </Pressable>
        ))}
      </View>
      
      {/* Workouts List */}
      {filteredWorkouts.length > 0 ? (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <IconSymbol name="clock.badge.exclamationmark" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateTitle}>Nenhum treino encontrado</Text>
          <Text style={styles.emptyStateMessage}>
            {selectedPeriod === 'week' 
              ? 'Você não tem treinos nesta semana ainda.'
              : selectedPeriod === 'month'
              ? 'Você não tem treinos neste mês ainda.'
              : 'Você ainda não completou nenhum treino.'}
          </Text>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    color: colors.text,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  statsCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: Typography.fontSizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  workoutCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  workoutInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  workoutName: {
    fontSize: Typography.fontSizes.md,
    color: colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  workoutDate: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  workoutStats: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  exercisesList: {
    gap: Spacing.sm,
  },
  exerciseItem: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  exerciseName: {
    fontSize: Typography.fontSizes.md,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  moreExercises: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  workoutHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.error + '10',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSizes.lg,
    color: colors.text,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateMessage: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});