import React from 'react';
import { Text, View } from 'react-native';
import { createSharedHomeScreenStyles, ThemeColors } from './HomeScreenStyles';

interface StatsData {
  totalWorkouts: number;
  thisWeek: number;
  currentStreak: number;
}

interface StatsSectionProps {
  colors: ThemeColors;
  isGeorgia?: boolean;
  stats: StatsData;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  colors,
  isGeorgia = false,
  stats,
}) => {
  const styles = createSharedHomeScreenStyles(colors, isGeorgia);

  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Estatísticas</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total de{'\n'}Treinos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.thisWeek}</Text>
          <Text style={styles.statLabel}>Esta{'\n'}Semana</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Sequência{'\n'}Atual</Text>
        </View>
      </View>
    </View>
  );
};