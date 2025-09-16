import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WorkoutSession } from '@/hooks/WorkoutContext';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

interface WorkoutHistoryCardProps {
  workout: WorkoutSession;
  onDelete: (sessionId: string) => void;
}

export const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({
  workout,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);

  // Calcular estatísticas do treino
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completedSets = workout.exercises.reduce((sum, exercise) => sum + exercise.completedSets.length, 0);
  const completionRate = Math.round((completedSets / totalSets) * 100);
  const averageWeight = workout.exercises.reduce((sum, exercise) => sum + (exercise.weight || 0), 0) / workout.exercises.length;

  // Formatar data
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  // Formatar tempo
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Obter ícone e cor do treino
  const getWorkoutIcon = (workoutName: string) => {
    if (workoutName.includes('Pernas')) return 'figure.run';
    if (workoutName.includes('Peito')) return 'figure.strengthtraining.traditional';
    if (workoutName.includes('Costas')) return 'figure.walk';
    if (workoutName.includes('Ombro')) return 'figure.mixed.cardio';
    return 'dumbbell';
  };

  const getWorkoutColor = (workoutName: string) => {
    if (workoutName.includes('Pernas')) return colors.success;
    if (workoutName.includes('Peito')) return colors.primary;
    if (workoutName.includes('Costas')) return colors.secondary;
    if (workoutName.includes('Ombro')) return colors.warning;
    return colors.primary;
  };

  // Obter o template do treino para mostrar o nome correto
  const getWorkoutTemplate = (workoutId: string) => {
    const templates = [
      { id: 'template-a', name: 'A — Pernas + Core' },
      { id: 'template-b', name: 'B — Peito + Tríceps' },
      { id: 'template-c', name: 'C — Costas + Bíceps' },
      { id: 'template-d', name: 'D — Ombro + Trapézio + Core' },
      { id: 'template-e', name: 'E — Pernas (variação)' },
    ];
    return templates.find(t => t.id === workoutId)?.name || workoutId;
  };

  const workoutName = getWorkoutTemplate(workout.workoutId);
  const workoutColor = getWorkoutColor(workoutName);
  const workoutIcon = getWorkoutIcon(workoutName);

  const handleDelete = () => {
    Alert.alert(
      'Deletar Treino',
      'Tem certeza que deseja deletar este treino? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: () => onDelete(workout.id)
        }
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Header do Card */}
      <View style={styles.header}>
        <View style={styles.workoutInfo}>
          <View style={[styles.workoutIcon, { backgroundColor: workoutColor + '20' }]}>
            <IconSymbol name={workoutIcon as any} size={24} color={workoutColor} />
          </View>
           <View style={styles.workoutDetails}>
             <Text style={styles.workoutName}>{workoutName}</Text>
             <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
           </View>
        </View>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <IconSymbol name="trash" size={18} color={colors.error} />
        </Pressable>
      </View>

      {/* Estatísticas do Treino */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <IconSymbol name="clock" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{formatDuration(workout.duration)}</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="dumbbell" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{workout.exercises.length} exercícios</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="checkmark.circle" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{completedSets}/{totalSets} séries</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="percent" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{completionRate}%</Text>
        </View>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${completionRate}%`,
                backgroundColor: completionRate === 100 ? colors.success : colors.primary
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{completionRate}% completo</Text>
      </View>

      {/* Peso Médio */}
      {averageWeight > 0 && (
        <View style={styles.weightContainer}>
          <IconSymbol name="scalemass" size={16} color={colors.textSecondary} />
          <Text style={styles.weightText}>Peso médio: {averageWeight.toFixed(1)}kg</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  workoutDate: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
    minWidth: '45%',
  },
  statText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
  },
  progressContainer: {
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: Typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weightText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
  },
});
