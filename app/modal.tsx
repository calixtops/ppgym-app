import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { workoutTemplates } from '@/constants/workoutTemplates';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutRotation } from '@/hooks/WorkoutContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutHistoryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { workoutSessions, getWorkoutHistory, selectedProgram, deleteWorkoutSession, clearAllData } = useWorkoutRotation();
  
  const [filterProgram, setFilterProgram] = useState<'all' | 'pedro' | 'georgia'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [showFilters, setShowFilters] = useState(false);

    // Obter histórico completo
  const fullHistory = useMemo(() => {
    // Primeiro, adicionar o workoutName a todas as sessões
    let history = workoutSessions.map(session => ({
      ...session,
      workoutName: workoutTemplates.find(t => t.id === session.workoutId)?.name || session.workoutId
    }));
    
    // Filtrar por programa se necessário
    if (filterProgram !== 'all') {
      history = history.filter(session => {
        const isGeorgiaWorkout = session.workoutId?.includes('georgia');
        return filterProgram === 'georgia' ? isGeorgiaWorkout : !isGeorgiaWorkout;
      });
    }
    
    // Filtrar por status
    if (filterStatus !== 'all') {
      history = history.filter(session => 
        filterStatus === 'completed' ? session.completed : !session.completed
      );
    }
    
    // Ordenar por data (mais recente primeiro)
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workoutSessions, filterProgram, filterStatus]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const completedSessions = workoutSessions.filter(s => s.completed);
    const totalSessions = workoutSessions.length;
    const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
    
    // Calcular tempo médio de treino
    const completedWithDuration = completedSessions.filter(s => s.duration);
    const avgDuration = completedWithDuration.length > 0 
      ? completedWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0) / completedWithDuration.length 
      : 0;

    return {
      totalSessions,
      completedSessions: completedSessions.length,
      completionRate: Math.round(completionRate),
      avgDuration: Math.round(avgDuration)
    };
  }, [workoutSessions]);

  const handleSessionPress = (session: any) => {
    if (session.completed) {
      // Mostrar detalhes da sessão completada
      Alert.alert(
        'Treino Concluído',
        `${session.workoutName || 'Treino'}\nData: ${new Date(session.date).toLocaleDateString('pt-BR')}\nDuração: ${session.duration || 'N/A'} min\nExercícios: ${session.exercises?.length || 0}`,
        [{ text: 'OK' }]
      );
    } else {
      // Permitir continuar treino incompleto
      Alert.alert(
        'Treino Incompleto',
        'Deseja continuar este treino?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Continuar', 
            onPress: () => router.push(`/workout-detail?workoutId=${session.workoutId}`)
          }
        ]
      );
    }
  };

  const handleDeleteSession = (session: any) => {
    Alert.alert(
      'Deletar Treino',
      `Tem certeza que deseja deletar este treino?\n\n${session.workoutName || 'Treino'}\nData: ${new Date(session.date).toLocaleDateString('pt-BR')}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkoutSession(session.id);
              Alert.alert('Sucesso', 'Treino deletado com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o treino. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAllSessions = () => {
    if (workoutSessions.length === 0) {
      Alert.alert('Info', 'Não há treinos para deletar.');
      return;
    }

    Alert.alert(
      'Deletar Todos os Treinos',
      `Tem certeza que deseja deletar TODOS os ${workoutSessions.length} treinos?\n\nEsta ação não pode ser desfeita!`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar Todos', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Sucesso', 'Todos os treinos foram deletados!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar os treinos. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Histórico de Treinos</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setShowFilters(true)} style={styles.filterButton}>
            <IconSymbol name="line.3.horizontal.decrease" size={24} color={colors.primary} />
          </Pressable>
          <Pressable onPress={handleDeleteAllSessions} style={styles.deleteAllButton}>
            <IconSymbol name="trash" size={22} color="#FF5252" />
          </Pressable>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalSessions}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completedSessions}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Taxa</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.avgDuration}</Text>
          <Text style={styles.statLabel}>Min/Treino</Text>
        </View>
      </View>

      {/* Lista de treinos */}
      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {fullHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="figure.strengthtraining.traditional" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum treino encontrado</Text>
            <Text style={styles.emptySubtext}>
              {filterProgram !== 'all' || filterStatus !== 'all' 
                ? 'Tente ajustar os filtros' 
                : 'Comece seu primeiro treino!'}
            </Text>
          </View>
        ) : (
          fullHistory.map((session) => (
            <WorkoutHistoryCard
              key={session.id}
              session={session}
              colors={colors}
              onPress={() => handleSessionPress(session)}
              onDelete={() => handleDeleteSession(session)}
            />
          ))
        )}
      </ScrollView>

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Filtro por programa */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Programa</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'pedro', label: 'Pedro' },
                  { key: 'georgia', label: 'Georgia' }
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      filterProgram === option.key && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setFilterProgram(option.key as any)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: filterProgram === option.key ? colors.background : colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Filtro por status */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Status</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'completed', label: 'Concluídos' },
                  { key: 'incomplete', label: 'Incompletos' }
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      filterStatus === option.key && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setFilterStatus(option.key as any)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: filterStatus === option.key ? colors.background : colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={[styles.applyButtonText, { color: colors.background }]}>
                Aplicar Filtros
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Componente para cada item do histórico
function WorkoutHistoryCard({ 
  session, 
  colors, 
  onPress,
  onDelete
}: { 
  session: any; 
  colors: any; 
  onPress: () => void; 
  onDelete: () => void;
}) {
  const isGeorgiaWorkout = session.workoutId?.includes('georgia');
  const programName = isGeorgiaWorkout ? 'Georgia' : 'Pedro';
  const programColor = isGeorgiaWorkout ? '#FF6B9D' : '#4ECDC4';
  const styles = createStyles(colors);

  return (
    <View style={[styles.historyCard, { backgroundColor: colors.cardBackground }]}>
      <Pressable style={styles.cardPressable} onPress={onPress}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
              {session.workoutName || 'Treino sem nome'}
            </Text>
            <View style={[styles.programBadge, { backgroundColor: programColor }]}>
              <Text style={styles.programBadgeText}>{programName}</Text>
            </View>
          </View>
          <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
            {new Date(session.date).toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardStats}>
            <View style={styles.cardStat}>
              <IconSymbol name="timer" size={16} color={colors.textSecondary} />
              <Text style={[styles.cardStatText, { color: colors.textSecondary }]}>
                {session.duration ? `${session.duration} min` : 'N/A'}
              </Text>
            </View>
            <View style={styles.cardStat}>
              <IconSymbol name="figure.strengthtraining.traditional" size={16} color={colors.textSecondary} />
              <Text style={[styles.cardStatText, { color: colors.textSecondary }]}>
                {session.exercises?.length || 0} exercícios
              </Text>
            </View>
          </View>

          <View style={[
            styles.statusBadge, 
            { backgroundColor: session.completed ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.statusBadgeText}>
              {session.completed ? 'Concluído' : 'Incompleto'}
            </Text>
          </View>
        </View>
      </Pressable>
      
      {/* Botão de deletar */}
      <Pressable 
        style={styles.deleteButton} 
        onPress={onDelete}
        android_ripple={{ color: '#FF5252', radius: 20 }}
      >
        <IconSymbol name="trash" size={18} color="#FF5252" />
      </Pressable>
    </View>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    filterButton: {
      padding: 8,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    deleteAllButton: {
      padding: 8,
      marginLeft: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.cardBackground,
      marginHorizontal: 20,
      marginVertical: 16,
      borderRadius: 12,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    historyList: {
      flex: 1,
      paddingHorizontal: 20,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    historyCard: {
      padding: 0,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    cardPressable: {
      flex: 1,
      padding: 16,
    },
    deleteButton: {
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FF525220',
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    cardHeader: {
      marginBottom: 12,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
      marginRight: 8,
    },
    programBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    programBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'white',
    },
    cardDate: {
      fontSize: 14,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardStat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    cardStatText: {
      fontSize: 14,
      marginLeft: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'white',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
    },
    filterSection: {
      marginBottom: 24,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    filterOptions: {
      flexDirection: 'row',
      gap: 8,
    },
    filterOption: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
    },
    filterOptionText: {
      fontSize: 14,
      fontWeight: '500',
    },
    applyButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
