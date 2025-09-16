import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WorkoutSession } from '@/hooks/WorkoutContext';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface WorkoutSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  workoutSession: WorkoutSession | null;
  totalTime: string;
  nextWorkoutName?: string;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  visible,
  onClose,
  workoutSession,
  totalTime,
  nextWorkoutName,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);

  if (!workoutSession) {
    return null;
  }

  const totalExercises = workoutSession.exercises.length;
  const totalSets = workoutSession.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completedSets = workoutSession.exercises.reduce((sum, exercise) => sum + (exercise.completedSets?.length || 0), 0);
  const averageWeight = workoutSession.exercises.reduce((sum, exercise) => {
    const weight = exercise.weight || 0;
    return sum + weight;
  }, 0) / totalExercises;
  const completionRate = Math.round((completedSets / totalSets) * 100);

  const heaviestExercises = workoutSession.exercises
    .filter(ex => (ex.weight || 0) > 0)
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 3);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.celebrationHeader}>
              <View style={styles.celebrationIcon}>
                <Text style={styles.celebrationEmoji}>🎉</Text>
              </View>
              <Text style={styles.celebrationTitle}>Treino Concluído!</Text>
              <Text style={styles.celebrationSubtitle}>
                Parabéns! Você arrasou no treino de hoje
              </Text>
            </View>

            <View style={styles.mainStatsContainer}>
              <View style={styles.timeSection}>
                <View style={styles.timeDisplay}>
                  <IconSymbol name="clock.fill" size={24} color={colors.primary} />
                  <Text style={styles.timeValue}>{totalTime}</Text>
                </View>
                <Text style={styles.timeLabel}>Tempo Total</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{completedSets}</Text>
                  <Text style={styles.statLabel}>Séries</Text>
                  <Text style={styles.statSubLabel}>Completas</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{totalExercises}</Text>
                  <Text style={styles.statLabel}>Exercícios</Text>
                  <Text style={styles.statSubLabel}>Realizados</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{completionRate}%</Text>
                  <Text style={styles.statLabel}>Conclusão</Text>
                  <Text style={styles.statSubLabel}>Taxa</Text>
                </View>
              </View>
            </View>

            {averageWeight > 0 && (
              <View style={styles.weightSection}>
                <View style={styles.weightCard}>
                  <IconSymbol name="dumbbell.fill" size={20} color={colors.primary} />
                  <Text style={styles.weightText}>
                    Peso médio: {averageWeight.toFixed(1)}kg
                  </Text>
                </View>
              </View>
            )}

            {heaviestExercises.length > 0 && (
              <View style={styles.highlightsSection}>
                <Text style={styles.sectionTitle}>🏆 Destaques</Text>
                {heaviestExercises.map((exercise, index) => (
                  <View key={exercise.exerciseId} style={styles.highlightItem}>
                    <View style={styles.highlightRank}>
                      <Text style={styles.rankNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.highlightInfo}>
                      <Text style={styles.highlightName}>{exercise.name}</Text>
                      <Text style={styles.highlightWeight}>{exercise.weight}kg</Text>
                    </View>
                    <View style={styles.highlightSets}>
                      <Text style={styles.highlightSetsText}>
                        {exercise.completedSets?.length || 0}/{exercise.sets}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {nextWorkoutName && (
              <View style={styles.nextWorkoutSection}>
                <View style={styles.nextWorkoutCard}>
                  <View style={styles.nextWorkoutHeader}>
                    <IconSymbol name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.nextWorkoutTitle}>Próximo Treino</Text>
                  </View>
                  <Text style={styles.nextWorkoutName}>{nextWorkoutName}</Text>
                  <Text style={styles.nextWorkoutMessage}>
                    Descanse bem! Vamos continuar amanhã 💪
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.actionSection}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Finalizar</Text>
                <IconSymbol name="checkmark" size={20} color="#ffffff" />
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    paddingTop: Spacing.md,
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  celebrationHeader: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: colors.primary + '10',
    marginHorizontal: -Spacing.md,
    marginTop: -Spacing.md,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  celebrationIcon: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  celebrationEmoji: {
    fontSize: 40,
  },
  celebrationTitle: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  celebrationSubtitle: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  mainStatsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  timeValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.primary,
  },
  timeLabel: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: Spacing.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: Typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  weightSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  weightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  weightText: {
    fontSize: Typography.fontSizes.md,
    color: colors.text,
    fontWeight: Typography.fontWeights.medium,
  },
  highlightsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.md,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rankNumber: {
    color: '#ffffff',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
  highlightInfo: {
    flex: 1,
  },
  highlightName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: colors.text,
  },
  highlightWeight: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  highlightSets: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  highlightSetsText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  nextWorkoutSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  nextWorkoutCard: {
    backgroundColor: colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  nextWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  nextWorkoutTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    color: colors.textSecondary,
  },
  nextWorkoutName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  nextWorkoutMessage: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actionSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
});