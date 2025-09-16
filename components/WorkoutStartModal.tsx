import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { workoutTemplates } from '@/constants/workoutTemplates';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface WorkoutStartModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: (workoutId: string) => void;
  workoutId: string;
}

const { width } = Dimensions.get('window');

export const WorkoutStartModal: React.FC<WorkoutStartModalProps> = ({
  visible,
  onClose,
  onStart,
  workoutId,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);

  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [shouldStart, setShouldStart] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  const workout = workoutTemplates.find(t => t.id === workoutId);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  // Effect para chamar onStart quando shouldStart for true
  useEffect(() => {
    if (shouldStart) {
      onStart(workoutId);
      setShouldStart(false);
    }
  }, [shouldStart, onStart, workoutId]);

  const startCountdown = () => {
    setIsCounting(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsCounting(false);
          setShouldStart(true); // Marcar para iniciar após a atualização do estado
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    // Animação de pulso durante countdown
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      clearInterval(countdownInterval);
      pulseAnimation.stop();
    };
  };

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

  if (!workout) return null;

  const workoutColor = getWorkoutColor(workout.name);
  const workoutIcon = getWorkoutIcon(workout.name);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.workoutIcon, { backgroundColor: workoutColor + '20' }]}>
                <IconSymbol name={workoutIcon as any} size={32} color={workoutColor} />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDescription}>{workout.description}</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Workout Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{workout.exercises.length}</Text>
                <Text style={styles.statLabel}>Exercícios</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {workout.exercises.reduce((total, ex) => total + ex.sets, 0)}
                </Text>
                <Text style={styles.statLabel}>Séries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>~60</Text>
                <Text style={styles.statLabel}>Minutos</Text>
              </View>
            </View>

            {/* Exercise Preview */}
            <View style={styles.exercisePreview}>
              <Text style={styles.previewTitle}>Exercícios do Treino</Text>
              <View style={styles.exerciseList}>
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <View style={styles.exerciseBullet} />
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseSets}>
                      {exercise.sets}×{exercise.reps}
                    </Text>
                  </View>
                ))}
                {workout.exercises.length > 3 && (
                  <Text style={styles.moreExercises}>
                    +{workout.exercises.length - 3} exercícios...
                  </Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.startButton, { backgroundColor: workoutColor }]}
                onPress={startCountdown}
                disabled={isCounting}
              >
                {isCounting ? (
                  <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                    <Text style={styles.countdownLabel}>Iniciando...</Text>
                  </View>
                ) : (
                  <View style={styles.startButtonContent}>
                    <IconSymbol name="play.fill" size={20} color="#ffffff" />
                    <Text style={styles.startButtonText}>Iniciar Treino</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    elevation: 10,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 2,
  },
  workoutDescription: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  exercisePreview: {
    marginBottom: Spacing.lg,
  },
  previewTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.md,
  },
  exerciseList: {
    gap: Spacing.sm,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  exerciseBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  exerciseName: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    color: colors.text,
  },
  exerciseSets: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
  },
  moreExercises: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: Typography.fontWeights.medium,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
  },
  startButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  startButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: '#ffffff',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#ffffff',
  },
  countdownLabel: {
    fontSize: Typography.fontSizes.sm,
    color: '#ffffff',
    opacity: 0.8,
  },
});
