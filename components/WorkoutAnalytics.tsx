import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface WorkoutAnalyticsProps {
  workoutSessions: any[];
  colors: any;
  selectedProgram?: string;
}

interface AnalyticsData {
  progressionData: Array<{
    date: string;
    completedWorkouts: number;
    totalTime: number;
  }>;
  frequencyData: {
    thisWeek: number;
    thisMonth: number;
    average: number;
  };
  performanceData: {
    bestStreak: number;
    currentStreak: number;
    completionRate: number;
    avgDuration: number;
  };
  programStats: {
    pedroCount: number;
    georgiaCount: number;
    favoriteProgram: string;
  };
}

export function WorkoutAnalytics({ workoutSessions, colors, selectedProgram }: WorkoutAnalyticsProps) {
  const analytics: AnalyticsData = useMemo(() => {
    const completedSessions = workoutSessions.filter(s => s.completed);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Progressão por data
    const progressionMap = new Map<string, { completed: number; totalTime: number }>();
    completedSessions.forEach(session => {
      const dateKey = new Date(session.date).toDateString();
      const existing = progressionMap.get(dateKey) || { completed: 0, totalTime: 0 };
      progressionMap.set(dateKey, {
        completed: existing.completed + 1,
        totalTime: existing.totalTime + (session.duration || 0)
      });
    });

    const progressionData = Array.from(progressionMap.entries())
      .map(([date, data]) => ({
        date,
        completedWorkouts: data.completed,
        totalTime: data.totalTime
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Últimos 30 dias

    // Frequência
    const thisWeekSessions = completedSessions.filter(s => 
      new Date(s.date) >= oneWeekAgo
    ).length;
    
    const thisMonthSessions = completedSessions.filter(s => 
      new Date(s.date) >= oneMonthAgo
    ).length;

    const totalDays = Math.ceil((now.getTime() - new Date(completedSessions[0]?.date || now).getTime()) / (24 * 60 * 60 * 1000)) || 1;
    const averageFrequency = completedSessions.length / (totalDays / 7); // por semana

    // Performance
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    // Calcular streaks (dias consecutivos com treino)
    const dates = completedSessions.map(s => new Date(s.date).toDateString()).sort();
    const uniqueDates = [...new Set(dates)];
    
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0 || 
          new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i-1]).getTime() <= 24 * 60 * 60 * 1000) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);
    
    // Current streak (desde hoje para trás)
    const today = new Date().toDateString();
    if (uniqueDates.includes(today)) {
      currentStreak = 1;
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const dayDiff = (new Date(uniqueDates[i+1]).getTime() - new Date(uniqueDates[i]).getTime()) / (24 * 60 * 60 * 1000);
        if (dayDiff <= 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    const completionRate = workoutSessions.length > 0 ? 
      (completedSessions.length / workoutSessions.length) * 100 : 0;

    const avgDuration = completedSessions.length > 0 ?
      completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length : 0;

    // Stats por programa
    const pedroSessions = completedSessions.filter(s => !s.workoutId?.includes('georgia'));
    const georgiaSessions = completedSessions.filter(s => s.workoutId?.includes('georgia'));
    
    const favoriteProgram = pedroSessions.length > georgiaSessions.length ? 'Pedro' : 
                          georgiaSessions.length > pedroSessions.length ? 'Georgia' : 'Empate';

    return {
      progressionData,
      frequencyData: {
        thisWeek: thisWeekSessions,
        thisMonth: thisMonthSessions,
        average: Math.round(averageFrequency * 10) / 10
      },
      performanceData: {
        bestStreak,
        currentStreak,
        completionRate: Math.round(completionRate),
        avgDuration: Math.round(avgDuration)
      },
      programStats: {
        pedroCount: pedroSessions.length,
        georgiaCount: georgiaSessions.length,
        favoriteProgram
      }
    };
  }, [workoutSessions]);

  const styles = createStyles(colors);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {/* Frequência */}
      <View style={styles.analyticsCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="calendar" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Frequência</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.frequencyData.thisWeek}</Text>
            <Text style={styles.metricLabel}>Esta semana</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.frequencyData.thisMonth}</Text>
            <Text style={styles.metricLabel}>Este mês</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.frequencyData.average}</Text>
            <Text style={styles.metricLabel}>Média/semana</Text>
          </View>
        </View>
      </View>

      {/* Performance */}
      <View style={styles.analyticsCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Performance</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.performanceData.currentStreak}</Text>
            <Text style={styles.metricLabel}>Sequência atual</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.performanceData.bestStreak}</Text>
            <Text style={styles.metricLabel}>Melhor sequência</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.performanceData.completionRate}%</Text>
            <Text style={styles.metricLabel}>Taxa conclusão</Text>
          </View>
        </View>
      </View>

      {/* Programas */}
      <View style={styles.analyticsCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="person.2" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Programas</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.programStats.pedroCount}</Text>
            <Text style={styles.metricLabel}>Pedro</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.programStats.georgiaCount}</Text>
            <Text style={styles.metricLabel}>Georgia</Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { fontSize: 14 }]}>
              {analytics.programStats.favoriteProgram}
            </Text>
            <Text style={styles.metricLabel}>Favorito</Text>
          </View>
        </View>
      </View>

      {/* Duração */}
      <View style={styles.analyticsCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="timer" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Duração</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{analytics.performanceData.avgDuration}</Text>
            <Text style={styles.metricLabel}>Média (min)</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {Math.round((analytics.performanceData.avgDuration * analytics.frequencyData.thisMonth) / 60 * 10) / 10}
            </Text>
            <Text style={styles.metricLabel}>Horas/mês</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {workoutSessions.filter(s => s.completed && s.duration).length}
            </Text>
            <Text style={styles.metricLabel}>Com duração</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginVertical: 16,
    },
    analyticsCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: 200,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 8,
    },
    cardContent: {
      gap: 12,
    },
    metric: {
      alignItems: 'center',
    },
    metricValue: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    metricLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  });
}