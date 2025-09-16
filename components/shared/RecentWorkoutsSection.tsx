import React from 'react';
import { Text, View } from 'react-native';
import { createSharedHomeScreenStyles, ThemeColors } from './HomeScreenStyles';

interface RecentWorkout {
  name: string;
  date: string;
  duration?: string;
  exercises?: number;
}

interface RecentWorkoutsSectionProps {
  colors: ThemeColors;
  isGeorgia?: boolean;
  workouts: RecentWorkout[];
}

export const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  colors,
  isGeorgia = false,
  workouts = [], // Default para array vazio
}) => {
  const styles = createSharedHomeScreenStyles(colors, isGeorgia);

  if (!workouts || workouts.length === 0) {
    return (
      <View style={styles.recentWorkoutsSection}>
        <Text style={styles.sectionTitle}>Treinos Recentes</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Ainda não há treinos registrados.{'\n'}
            Comece seu primeiro treino hoje!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.recentWorkoutsSection}>
      <Text style={styles.sectionTitle}>Treinos Recentes</Text>
      
      {workouts.map((workout, index) => (
        <View key={index} style={styles.recentWorkoutCard}>
          <View style={styles.recentWorkoutHeader}>
            <Text style={styles.recentWorkoutName}>{workout.name}</Text>
            <Text style={styles.recentWorkoutDate}>{workout.date}</Text>
          </View>
          
          <View style={styles.recentWorkoutStats}>
            {workout.duration && (
              <Text style={styles.recentWorkoutStat}>
                ⏱️ {workout.duration}
              </Text>
            )}
            {workout.exercises && (
              <Text style={styles.recentWorkoutStat}>
                💪 {workout.exercises} exercícios
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};