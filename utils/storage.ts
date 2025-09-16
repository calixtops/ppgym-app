import { WorkoutProgress, WorkoutSession } from '@/hooks/WorkoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// As chaves base serão prefixadas com o ID do usuário
const STORAGE_KEYS = {
  WORKOUT_SESSIONS: 'workout_sessions',
  WORKOUT_PROGRESS: 'workout_progress',
  WORKOUT_PROGRAM: 'workout_program',
  WORKOUT_SCHEDULE: 'workout_schedule',
  SELECTED_PROGRAM: 'selected_program',
};

// Função auxiliar para salvar dados
const saveData = async (key: string, data: any): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

// Função auxiliar para carregar dados
const loadData = async (key: string): Promise<any> => {
  try {
    if (Platform.OS === 'web') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } else {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
};

export const StorageService = {
  // Salvar sessões de treino
  async saveWorkoutSessions(sessions: WorkoutSession[]): Promise<void> {
    try {
      console.log('💾 Salvando sessões de treino. Total:', sessions.length);
      console.log('💾 Sessões completas:', sessions.filter(s => s.completed).length);
      await saveData(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
      console.log('✅ Sessões salvas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar sessões de treino:', error);
    }
  },

  // Carregar sessões de treino
  async loadWorkoutSessions(): Promise<WorkoutSession[]> {
    try {
      const data = await loadData(STORAGE_KEYS.WORKOUT_SESSIONS);
      if (data) {
        // Converter strings de data de volta para objetos Date
        return data.map((session: any) => ({
          ...session,
          date: new Date(session.date),
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar sessões de treino:', error);
      return [];
    }
  },

  // Salvar progresso dos exercícios
  async saveWorkoutProgress(progress: { [key: string]: WorkoutProgress }): Promise<void> {
    try {
      await saveData(STORAGE_KEYS.WORKOUT_PROGRESS, progress);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  },

  // Carregar progresso dos exercícios
  async loadWorkoutProgress(): Promise<{ [key: string]: WorkoutProgress }> {
    try {
      const data = await loadData(STORAGE_KEYS.WORKOUT_PROGRESS);
      return data || {};
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      return {};
    }
  },

  // Salvar programa de treino
  async saveWorkoutProgram(program: any): Promise<void> {
    try {
      await saveData(STORAGE_KEYS.WORKOUT_PROGRAM, program);
    } catch (error) {
      console.error('Erro ao salvar programa de treino:', error);
    }
  },

  // Carregar programa de treino
  async loadWorkoutProgram(): Promise<any> {
    try {
      const data = await loadData(STORAGE_KEYS.WORKOUT_PROGRAM);
      return data;
    } catch (error) {
      console.error('Erro ao carregar programa de treino:', error);
      return null;
    }
  },

  // Salvar agendamento de treinos
  async saveWorkoutSchedule(schedule: any): Promise<void> {
    try {
      await saveData(STORAGE_KEYS.WORKOUT_SCHEDULE, schedule);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  },

  // Carregar agendamento de treinos
  async loadWorkoutSchedule(): Promise<any> {
    try {
      const data = await loadData(STORAGE_KEYS.WORKOUT_SCHEDULE);
      if (data) {
        return {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar agendamento:', error);
      return null;
    }
  },

  // Limpar todos os dados
  async clearAllData(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSIONS);
        localStorage.removeItem(STORAGE_KEYS.WORKOUT_PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.WORKOUT_PROGRAM);
        localStorage.removeItem(STORAGE_KEYS.WORKOUT_SCHEDULE);
      } else {
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.WORKOUT_SESSIONS,
          STORAGE_KEYS.WORKOUT_PROGRESS,
          STORAGE_KEYS.WORKOUT_PROGRAM,
          STORAGE_KEYS.WORKOUT_SCHEDULE,
        ]);
      }
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  },

  // Métodos genéricos para outros tipos de dados
  async setItem(key: string, value: any): Promise<void> {
    await saveData(key, value);
  },

  async getItem(key: string): Promise<any> {
    return await loadData(key);
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  },

  // Salvar contador de treinos completados
  async saveCompletedWorkoutsCount(count: number): Promise<void> {
    try {
      console.log('💾 Salvando contador de treinos:', count);
      await saveData('completed_workouts_count', count);
      console.log('✅ Contador salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar contador:', error);
    }
  },

  // Carregar contador de treinos completados
  async loadCompletedWorkoutsCount(): Promise<number> {
    try {
      const data = await loadData('completed_workouts_count');
      return data || 0;
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
      return 0;
    }
  },

  // Salvar programa selecionado
  async saveSelectedProgram(program: 'pedro' | 'georgia'): Promise<void> {
    await saveData(STORAGE_KEYS.SELECTED_PROGRAM, program);
  },

  // Carregar programa selecionado
  async loadSelectedProgram(): Promise<'pedro' | 'georgia' | null> {
    try {
      const data = await loadData(STORAGE_KEYS.SELECTED_PROGRAM);
      return data; // null se nenhum programa foi selecionado
    } catch (error) {
      console.error('Erro ao carregar programa selecionado:', error);
      return null;
    }
  },
};
