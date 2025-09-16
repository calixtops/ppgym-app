import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createSharedHomeScreenStyles, ThemeColors } from './HomeScreenStyles';

interface HeroSectionProps {
  colors: ThemeColors;
  isGeorgia?: boolean;
  greeting: string;
  subtitle: string;
  workoutToShow: any;
  workoutStatus: 'completed' | 'pending';
  onStartWorkout: () => void;
  onStartTomorrowWorkout?: () => void;
  isTodaysWorkoutCompleted?: boolean;
  tomorrowWorkout?: any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  colors,
  isGeorgia = false,
  greeting,
  subtitle,
  workoutToShow,
  workoutStatus,
  onStartWorkout,
  onStartTomorrowWorkout,
  isTodaysWorkoutCompleted = false,
  tomorrowWorkout,
}) => {
  const styles = createSharedHomeScreenStyles(colors, isGeorgia);

  return (
    <View style={styles.heroSection}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Cartão do treino atual */}
      <View style={styles.workoutCard}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>
            {workoutToShow?.name || 'Sem treino disponível'}
          </Text>
          <Text style={[
            styles.workoutStatus,
            workoutStatus === 'completed' ? styles.statusCompleted : styles.statusPending
          ]}>
            {workoutStatus === 'completed' ? 'Concluído' : 'Pendente'}
          </Text>
        </View>

        {workoutToShow?.description && (
          <Text style={styles.workoutDescription}>
            {workoutToShow.description}
          </Text>
        )}

        <View style={styles.workoutActions}>
          <Pressable style={styles.primaryButton} onPress={() => onStartWorkout()}>
            <Text style={styles.primaryButtonText}>
              {workoutStatus === 'completed' ? 'Repetir Treino' : 'Iniciar Treino'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Cartão do treino de amanhã (se o de hoje estiver concluído) */}
      {isTodaysWorkoutCompleted && tomorrowWorkout && onStartTomorrowWorkout && (
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>
              Amanhã: {tomorrowWorkout.name}
            </Text>
            <Text style={[styles.workoutStatus, styles.statusPending]}>
              Próximo
            </Text>
          </View>

          {tomorrowWorkout.description && (
            <Text style={styles.workoutDescription}>
              {tomorrowWorkout.description}
            </Text>
          )}

          <View style={styles.workoutActions}>
            <Pressable style={styles.secondaryButton} onPress={() => onStartTomorrowWorkout()}>
              <Text style={styles.secondaryButtonText}>
                Treinar Amanhã Hoje
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};